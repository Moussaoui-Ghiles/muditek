#!/usr/bin/env python3
"""Regression and adversarial tests for calculate.py."""

from __future__ import annotations

import copy
import importlib.util
import json
import random
import subprocess
import sys
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("calculate.py")
SPEC = importlib.util.spec_from_file_location("outbound_calculator", MODULE_PATH)
assert SPEC and SPEC.loader
CALC = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CALC)


def base_cohort() -> dict:
    return {
        "cohort_id": "email-a",
        "name": "Email A",
        "motion": "cold_email",
        "basis": "actual",
        "matured": True,
        "requested_analyses": ["funnel", "cac", "customer_economics", "break_even", "payback"],
        "period": {"start": "2026-07-01", "end": "2026-07-31"},
        "analysis_date": "2026-09-30",
        "entry_definition": "Unique prospects receiving a first eligible email attempt",
        "definition_version": "v1",
        "attribution_window": "90 days",
        "win_definition": "Signed and first payment collected",
        "counts": {
            "entries": 1000,
            "accepted": 950,
            "positive_engagements": 55,
            "qualified_conversations": 35,
            "meetings_booked": 25,
            "meetings_held": 20,
            "qualified_opportunities": 8,
            "customers": 2,
        },
        "cost_boundary": "All acquisition work through first payment collection",
        "costs_confirmed_complete": True,
        "excluded_costs": [],
        "costs": [
            {"id": "data", "category": "data", "amount": 600, "treatment": "direct", "basis": "actual"},
            {"id": "labor", "category": "labor", "amount": 1800, "treatment": "direct", "basis": "actual"},
            {"id": "software", "category": "software", "amount": 300, "treatment": "allocated", "allocation_method": "1/3 by active cohort", "basis": "actual"},
        ],
        "economics": {
            "basis": "expected",
            "contribution_horizon": "first 12 months",
            "first_year_collected_revenue_per_customer": 18000,
            "first_year_direct_delivery_cost_per_customer": 7200,
            "additional_post_acquisition_cost_per_customer": 500,
            "lifetime_collected_revenue_per_customer": 30000,
            "lifetime_direct_delivery_cost_per_customer": 12000,
            "stable_monthly_gross_profit_per_customer": 900,
            "monthly_gross_profit_per_customer": [1800, 900, 900],
        },
    }


def document(cohorts: list[dict] | None = None) -> dict:
    return {"schema_version": "1.0", "currency": "USD", "cohorts": cohorts or [base_cohort()]}


def metrics(result: dict, group: str = "funnel_metrics", index: int = 0) -> dict:
    return {item["metric_id"]: item for item in result["cohorts"][index][group]}


class CalculatorTests(unittest.TestCase):
    def test_complete_example_exact_values(self) -> None:
        result = CALC.calculate_document(document())
        self.assertEqual(result["status"], "complete")
        funnel = metrics(result)
        economics = metrics(result, "economic_metrics")
        self.assertEqual(funnel["accepted_message_rate"]["value"], "0.950000")
        self.assertEqual(funnel["customer_rate"]["value"], "0.002000")
        self.assertEqual(economics["total_acquisition_cost"]["value"], "2700.00")
        self.assertEqual(economics["cac"]["value"], "1350.00")
        self.assertEqual(economics["first_year_gross_profit_per_customer"]["value"], "10800.00")
        self.assertEqual(economics["first_year_gross_profit_per_held_meeting"]["value"], "1080.00")
        self.assertEqual(economics["cost_per_qualified_conversation"]["value"], "77.14")
        self.assertEqual(economics["first_year_gross_profit_cac_coverage"]["formatted"], "8.00:1")
        self.assertEqual(economics["first_year_cohort_gross_contribution_after_acquisition"]["value"], "18900.00")
        self.assertEqual(economics["gross_profit_ltv_cac"]["formatted"], "13.33:1")
        self.assertEqual(economics["exact_cac_payback_month"]["value"], 1)
        self.assertEqual(economics["break_even_customers"]["value"], 1)
        self.assertEqual(economics["required_customer_rate"]["formatted"], "0.0262%")
        self.assertEqual(economics["required_customer_rate"]["whole_customer_operational_rate"], "0.1000%")

    def test_missing_is_unknown_not_zero(self) -> None:
        cohort = base_cohort()
        del cohort["counts"]["accepted"]
        result = CALC.calculate_document(document([cohort]))
        funnel = metrics(result)
        self.assertEqual(funnel["accepted_message_rate"]["status"], "unknown")
        self.assertIsNone(funnel["accepted_message_rate"]["value"])
        self.assertEqual(funnel["customer_rate"]["value"], "0.002000")
        self.assertEqual(result["status"], "partial")

    def test_explicit_zero_denominator_is_not_applicable(self) -> None:
        cohort = base_cohort()
        cohort["counts"] = {key: 0 for key in cohort["counts"]}
        result = CALC.calculate_document(document([cohort]))
        funnel = metrics(result)
        self.assertEqual(funnel["accepted_message_rate"]["status"], "not_applicable")
        self.assertEqual(funnel["customer_rate"]["status"], "not_applicable")

    def test_zero_customers_keeps_cost_and_does_not_report_zero_cac(self) -> None:
        cohort = base_cohort()
        cohort["counts"]["customers"] = 0
        result = CALC.calculate_document(document([cohort]))
        funnel = metrics(result)
        economics = metrics(result, "economic_metrics")
        self.assertEqual(funnel["customer_rate"]["value"], "0.000000")
        self.assertEqual(economics["total_acquisition_cost"]["value"], "2700.00")
        self.assertEqual(economics["cac"]["status"], "undefined_zero_customers")
        self.assertIsNone(economics["cac"]["value"])
        self.assertEqual(economics["gross_profit_ltv_cac"]["status"], "unknown")

    def test_stage_order_conflict_is_invalid_not_clipped(self) -> None:
        cohort = base_cohort()
        cohort["counts"]["meetings_held"] = 30
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "invalid")
        codes = {item["code"] for item in result["cohorts"][0]["issues"]}
        self.assertIn("stage_order_conflict", codes)
        self.assertEqual(result["cohorts"][0]["counts"]["meetings_held"], 30)

    def test_fractional_entity_count_is_invalid(self) -> None:
        cohort = base_cohort()
        cohort["counts"]["entries"] = 1000.5
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "invalid")
        codes = {item["code"] for item in result["cohorts"][0]["issues"]}
        self.assertIn("fractional_entity_count", codes)

    def test_linkedin_reach_requires_definition(self) -> None:
        cohort = base_cohort()
        cohort.update({"motion": "linkedin", "counts": {"entries": 100, "reached": 80, "positive_engagements": 10, "qualified_conversations": 6, "meetings_booked": 4, "meetings_held": 3, "qualified_opportunities": 2, "customers": 1}})
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "invalid")
        codes = {item["code"] for item in result["cohorts"][0]["issues"]}
        self.assertIn("missing_linkedin_reach_definition", codes)
        cohort["definitions"] = {"reached": "Connection accepted and first message sent"}
        corrected = CALC.calculate_document(document([cohort]))
        self.assertNotEqual(corrected["status"], "invalid")

    def test_named_account_uses_accounts(self) -> None:
        cohort = base_cohort()
        cohort.update({"motion": "named_account", "counts": {"entries": 50, "reached": 30, "positive_engagements": 12, "qualified_conversations": 8, "meetings_booked": 6, "meetings_held": 5, "qualified_opportunities": 3, "customers": 1}})
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["cohorts"][0]["unit"], "unique account")
        funnel = metrics(result)
        self.assertEqual(funnel["account_reach_rate"]["formatted"], "60.0000%")

    def test_allocated_cost_requires_method(self) -> None:
        cohort = base_cohort()
        del cohort["costs"][2]["allocation_method"]
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "invalid")
        codes = {item["code"] for item in result["cohorts"][0]["issues"]}
        self.assertIn("missing_allocation_method", codes)

    def test_unconfirmed_costs_are_disclosed(self) -> None:
        cohort = base_cohort()
        cohort["costs_confirmed_complete"] = False
        result = CALC.calculate_document(document([cohort]))
        economics = metrics(result, "economic_metrics")
        self.assertEqual(economics["total_acquisition_cost"]["label"], "Supplied acquisition cost")
        self.assertFalse(economics["total_acquisition_cost"]["costs_confirmed_complete"])
        self.assertEqual(result["status"], "partial")
        codes = {item["code"] for item in result["cohorts"][0]["issues"]}
        self.assertIn("unconfirmed_cost_coverage", codes)

    def test_conflicting_gross_profit_methods_are_invalid(self) -> None:
        cohort = base_cohort()
        cohort["economics"]["first_year_gross_margin"] = 0.8
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "invalid")
        economics = metrics(result, "economic_metrics")
        self.assertEqual(economics["first_year_gross_profit_per_customer"]["status"], "invalid")

    def test_nonpositive_contribution_is_economically_impossible(self) -> None:
        cohort = base_cohort()
        cohort["economics"]["additional_post_acquisition_cost_per_customer"] = 12000
        result = CALC.calculate_document(document([cohort]))
        economics = metrics(result, "economic_metrics")
        self.assertEqual(economics["break_even_customers"]["status"], "economically_impossible")
        self.assertEqual(economics["required_customer_rate"]["status"], "economically_impossible")

    def test_payback_not_recovered_within_series(self) -> None:
        cohort = base_cohort()
        cohort["economics"]["monthly_gross_profit_per_customer"] = [100, 100]
        result = CALC.calculate_document(document([cohort]))
        economics = metrics(result, "economic_metrics")
        self.assertEqual(economics["exact_cac_payback_month"]["status"], "not_recovered_within_series")
        self.assertIsNone(economics["exact_cac_payback_month"]["value"])

    def test_immature_actual_cohort_is_provisional(self) -> None:
        cohort = base_cohort()
        cohort["matured"] = False
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "provisional")
        self.assertEqual(metrics(result)["customer_rate"]["status"], "provisional")
        self.assertEqual(metrics(result, "economic_metrics")["cac"]["status"], "provisional")

    def test_unknown_maturity_does_not_produce_complete_customer_economics(self) -> None:
        cohort = base_cohort()
        cohort["matured"] = None
        result = CALC.calculate_document(document([cohort]))
        self.assertEqual(result["status"], "provisional")
        self.assertEqual(metrics(result)["customer_rate"]["status"], "provisional")

    def test_valid_comparison_returns_deltas(self) -> None:
        baseline = base_cohort()
        baseline["cohort_id"] = "base"
        candidate = copy.deepcopy(baseline)
        candidate["cohort_id"] = "candidate"
        candidate["counts"]["customers"] = 3
        data = document([baseline, candidate])
        data["comparisons"] = [{"comparison_id": "test", "baseline_cohort_id": "base", "candidate_cohort_id": "candidate"}]
        result = CALC.calculate_document(data)
        comparison = result["comparisons"][0]
        self.assertTrue(comparison["comparable"])
        delta_map = {item["metric_id"]: item for item in comparison["deltas"]}
        self.assertEqual(delta_map["customer_rate"]["absolute_delta"], "0.001000")

    def test_incompatible_comparison_is_blocked(self) -> None:
        baseline = base_cohort()
        baseline["cohort_id"] = "base"
        candidate = copy.deepcopy(baseline)
        candidate["cohort_id"] = "candidate"
        candidate["definition_version"] = "v2"
        data = document([baseline, candidate])
        data["comparisons"] = [{"comparison_id": "bad", "baseline_cohort_id": "base", "candidate_cohort_id": "candidate"}]
        result = CALC.calculate_document(data)
        self.assertEqual(result["comparisons"][0]["status"], "invalid")
        self.assertFalse(result["comparisons"][0]["comparable"])

    def test_expansion_scenario_is_labeled_and_calculated(self) -> None:
        data = document()
        data["expansion_scenarios"] = [{"scenario_id": "more", "baseline_cohort_id": "email-a", "basis": "assumption", "additional_cost": 3000, "expected_additional_customers": 1, "expected_contribution_per_customer": 10300, "contribution_horizon": "first 12 months"}]
        result = CALC.calculate_document(data)
        scenario = result["expansion_scenarios"][0]
        self.assertEqual(scenario["status"], "assumption")
        self.assertEqual(scenario["net_incremental_contribution"], "USD 7300.00")
        self.assertEqual(scenario["required_additional_customers"], 1)

    def test_input_fingerprint_is_deterministic(self) -> None:
        first = CALC.calculate_document(document())["input_fingerprint_sha256"]
        second = CALC.calculate_document(document())["input_fingerprint_sha256"]
        self.assertEqual(first, second)
        changed = document()
        changed["cohorts"][0]["counts"]["entries"] = 999
        third = CALC.calculate_document(changed)["input_fingerprint_sha256"]
        self.assertNotEqual(first, third)

    def test_random_monotone_funnels_never_emit_rate_outside_zero_to_one(self) -> None:
        generator = random.Random(7321)
        for index in range(500):
            values = [generator.randint(0, 5000)]
            for _ in range(7):
                values.append(generator.randint(0, values[-1]))
            cohort = {
                "cohort_id": f"random-{index}",
                "motion": "cold_email",
                "basis": "actual",
                "matured": True,
                "requested_analyses": ["funnel"],
                "entry_definition": "Unique prospects emailed",
                "definition_version": "property-v1",
                "attribution_window": "90 days",
                "counts": dict(zip(CALC.MOTION_CONFIG["cold_email"]["stages"], values)),
            }
            result = CALC.calculate_document(document([cohort]))
            self.assertNotEqual(result["status"], "invalid")
            for metric in metrics(result).values():
                if metric["value"] is not None:
                    value = CALC.Decimal(metric["value"])
                    self.assertGreaterEqual(value, 0)
                    self.assertLessEqual(value, 1)

    def test_cli_json_output_and_invalid_exit_code(self) -> None:
        invalid = document()
        invalid["cohorts"][0]["counts"]["customers"] = 99
        completed = subprocess.run(
            [sys.executable, str(MODULE_PATH), "--input", "-", "--format", "json"],
            input=json.dumps(invalid),
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(completed.returncode, 1)
        parsed = json.loads(completed.stdout)
        self.assertEqual(parsed["status"], "invalid")


if __name__ == "__main__":
    unittest.main(verbosity=2)
