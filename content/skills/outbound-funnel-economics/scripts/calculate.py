#!/usr/bin/env python3
"""Deterministic outbound funnel and unit-economics calculator.

The script accepts normalized JSON, validates units and definitions, and emits
machine-readable JSON or a Markdown audit. It intentionally contains no
benchmarks and makes no causal diagnosis.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from decimal import Decimal, InvalidOperation, ROUND_CEILING, ROUND_HALF_UP
from pathlib import Path
from typing import Any


CALCULATION_VERSION = "1.0.0"
SUPPORTED_SCHEMA_VERSION = "1.0"
MONEY_QUANTUM = Decimal("0.01")
RATE_QUANTUM = Decimal("0.000001")


MOTION_CONFIG: dict[str, dict[str, Any]] = {
    "cold_email": {
        "unit": "unique prospect",
        "stages": [
            "entries",
            "accepted",
            "positive_engagements",
            "qualified_conversations",
            "meetings_booked",
            "meetings_held",
            "qualified_opportunities",
            "customers",
        ],
        "labels": {
            "entries": "Unique prospects emailed",
            "accepted": "Technically accepted prospects",
            "positive_engagements": "Relevant positive replies",
            "qualified_conversations": "Qualified conversations",
            "meetings_booked": "Prospects with a meeting booked",
            "meetings_held": "Prospects with a meeting held",
            "qualified_opportunities": "Qualified opportunities",
            "customers": "Customers",
        },
        "metrics": [
            ("accepted_message_rate", "accepted", "entries", "Accepted-message rate"),
            ("positive_reply_rate", "positive_engagements", "accepted", "Positive-reply rate"),
            ("qualified_conversation_rate", "qualified_conversations", "accepted", "Qualified-conversation rate"),
        ],
    },
    "linkedin": {
        "unit": "unique prospect",
        "stages": [
            "entries",
            "reached",
            "positive_engagements",
            "qualified_conversations",
            "meetings_booked",
            "meetings_held",
            "qualified_opportunities",
            "customers",
        ],
        "labels": {
            "entries": "Prospects entering the defined LinkedIn path",
            "reached": "Prospects satisfying the defined reach event",
            "positive_engagements": "Relevant responses",
            "qualified_conversations": "Qualified conversations",
            "meetings_booked": "Prospects with a meeting booked",
            "meetings_held": "Prospects with a meeting held",
            "qualified_opportunities": "Qualified opportunities",
            "customers": "Customers",
        },
        "metrics": [
            ("reach_rate", "reached", "entries", "LinkedIn reach rate"),
            ("relevant_response_rate", "positive_engagements", "reached", "Relevant-response rate"),
            ("qualified_conversation_rate", "qualified_conversations", "reached", "Qualified-conversation rate"),
        ],
    },
    "named_account": {
        "unit": "unique account",
        "stages": [
            "entries",
            "reached",
            "positive_engagements",
            "qualified_conversations",
            "meetings_booked",
            "meetings_held",
            "qualified_opportunities",
            "customers",
        ],
        "labels": {
            "entries": "Activated accounts",
            "reached": "Accounts where an intended buyer was reached",
            "positive_engagements": "Accounts with relevant two-way engagement",
            "qualified_conversations": "Accounts with a qualified conversation",
            "meetings_booked": "Accounts with a meeting booked",
            "meetings_held": "Accounts with a meeting held",
            "qualified_opportunities": "Qualified opportunity accounts",
            "customers": "Customer accounts",
        },
        "metrics": [
            ("account_reach_rate", "reached", "entries", "Account-reach rate"),
            ("relevant_engagement_rate", "positive_engagements", "entries", "Relevant-engagement rate"),
            ("qualified_conversation_rate", "qualified_conversations", "entries", "Qualified-conversation rate"),
        ],
    },
}


COMMON_METRICS = [
    ("conversation_to_booking_rate", "meetings_booked", "qualified_conversations", "Conversation-to-booking rate"),
    ("attendance_rate", "meetings_held", "meetings_booked", "Attendance rate"),
    ("opportunity_rate", "qualified_opportunities", "meetings_held", "Opportunity rate"),
    ("win_rate", "customers", "qualified_opportunities", "Win rate"),
    ("customer_rate", "customers", "entries", "Customer rate"),
]


METRIC_GUIDANCE = {
    "accepted_message_rate": (
        "Share of emailed prospects with at least one message accepted by the recipient mail server.",
        "Inbox placement, human reach, attention, or interest.",
        "Address validity, bounces, authentication, sending configuration, and sender reputation.",
    ),
    "positive_reply_rate": (
        "Share of technically accepted prospects giving a relevant positive reply.",
        "Whether targeting, timing, offer, proof, or copy caused the result.",
        "Company fit, buyer fit, timing evidence, offer, proof, message, and underlying replies.",
    ),
    "reach_rate": (
        "Share of LinkedIn entries satisfying the predefined reach event.",
        "A universal notion of delivery, attention, or interest.",
        "Path execution, contact coverage, buyer-role mapping, and the reach definition.",
    ),
    "account_reach_rate": (
        "Share of activated accounts where at least one intended buyer was reached.",
        "Buyer authority, interest, or offer relevance.",
        "Contact coverage, buyer roles, channel selection, and execution.",
    ),
    "relevant_response_rate": (
        "Share of reached prospects giving a relevant response.",
        "Whether profile, fit, timing, offer, or message caused the result.",
        "Profile credibility, fit, timing, reason for contact, offer, and message.",
    ),
    "relevant_engagement_rate": (
        "Share of activated accounts producing relevant two-way engagement.",
        "Which component of the account plan caused the result.",
        "Account selection, buyer access, reason for contact, and coordinated outreach plan.",
    ),
    "qualified_conversation_rate": (
        "Share of the stated reach base entering a defined commercial conversation.",
        "Why other prospects or accounts did not qualify.",
        "Fit, qualification rules, and the underlying conversations.",
    ),
    "conversation_to_booking_rate": (
        "Share of qualified conversations producing a booked meeting.",
        "Whether the prospect would ultimately buy.",
        "Ask, response handling, qualification path, first commitment, and scheduling friction.",
    ),
    "attendance_rate": (
        "Share of booked-meeting entities producing at least one held meeting.",
        "That reminders alone will fix non-attendance.",
        "Meeting purpose, qualification depth, scheduling, expectations, and follow-up.",
    ),
    "opportunity_rate": (
        "Share of held-meeting entities becoming qualified opportunities.",
        "That either lead source or sales execution solely caused the result.",
        "Buyer authority, problem relevance, commercial fit, qualification, and discovery.",
    ),
    "win_rate": (
        "Share of qualified opportunities becoming customers.",
        "Whether the offer or salesperson alone caused the result.",
        "Proof, risk, terms, stakeholders, decision process, timing, and sales execution.",
    ),
    "customer_rate": (
        "Complete customer yield from the original cohort entries.",
        "Which earlier stage caused the result.",
        "Earlier stage transitions and the underlying records.",
    ),
}


def issue(severity: str, code: str, path: str, message: str, remedy: str = "") -> dict[str, str]:
    return {"severity": severity, "code": code, "path": path, "message": message, "remedy": remedy}


def to_decimal(value: Any, path: str, issues: list[dict[str, str]], *, allow_negative: bool = False) -> Decimal | None:
    if value is None or isinstance(value, bool):
        issues.append(issue("error", "invalid_number", path, "Expected a finite number."))
        return None
    try:
        parsed = Decimal(str(value))
    except (InvalidOperation, ValueError):
        issues.append(issue("error", "invalid_number", path, "Expected a finite number."))
        return None
    if not parsed.is_finite():
        issues.append(issue("error", "invalid_number", path, "Expected a finite number."))
        return None
    if not allow_negative and parsed < 0:
        issues.append(issue("error", "negative_value", path, "Negative values are not allowed."))
        return None
    return parsed


def to_count(value: Any, path: str, issues: list[dict[str, str]]) -> int | None:
    number = to_decimal(value, path, issues)
    if number is None:
        return None
    if number != number.to_integral_value():
        issues.append(issue("error", "fractional_entity_count", path, "Entity counts must be whole numbers."))
        return None
    return int(number)


def decimal_string(value: Decimal, places: Decimal = MONEY_QUANTUM) -> str:
    return format(value.quantize(places, rounding=ROUND_HALF_UP), "f")


def percent_string(value: Decimal) -> str:
    return f"{decimal_string(value * Decimal('100'), Decimal('0.0001'))}%"


def combine_basis(*bases: str | None) -> str:
    values = {b for b in bases if b and b != "unknown"}
    if not values:
        return "unknown"
    if values == {"actual"} or values == {"observed"}:
        return "observed"
    if values <= {"actual", "observed"}:
        return "observed"
    if values == {"expected"}:
        return "expected"
    if values == {"assumption"}:
        return "assumption"
    return "mixed"


def metric_status(basis: str, matured: bool | None, mature_required: bool = False) -> str:
    if mature_required and matured is not True and basis in {"actual", "observed"}:
        return "provisional"
    return combine_basis(basis)


def rate_metric(
    metric_id: str,
    label: str,
    numerator_key: str,
    denominator_key: str,
    counts: dict[str, int],
    basis: str,
    matured: bool | None,
) -> dict[str, Any]:
    meaning, limitation, investigate = METRIC_GUIDANCE[metric_id]
    result: dict[str, Any] = {
        "metric_id": metric_id,
        "label": label,
        "formula": f"{numerator_key} / {denominator_key}",
        "numerator_key": numerator_key,
        "denominator_key": denominator_key,
        "meaning": meaning,
        "cannot_establish": limitation,
        "investigate_next": investigate,
    }
    if numerator_key not in counts or denominator_key not in counts:
        result.update({"status": "unknown", "value": None, "formatted": "unknown"})
        return result
    numerator = counts[numerator_key]
    denominator = counts[denominator_key]
    result.update({"numerator": numerator, "denominator": denominator})
    if denominator == 0:
        if numerator > 0:
            result.update({"status": "invalid", "value": None, "formatted": "invalid"})
        else:
            result.update({"status": "not_applicable", "value": None, "formatted": "N/A"})
        return result
    if numerator > denominator:
        result.update({"status": "invalid", "value": None, "formatted": "invalid"})
        return result
    value = Decimal(numerator) / Decimal(denominator)
    result.update(
        {
            "status": metric_status(basis, matured, metric_id in {"win_rate", "customer_rate"}),
            "value": decimal_string(value, RATE_QUANTUM),
            "formatted": percent_string(value),
        }
    )
    return result


def money_metric(metric_id: str, label: str, value: Decimal | None, status: str, currency: str, formula: str, limitation: str = "") -> dict[str, Any]:
    return {
        "metric_id": metric_id,
        "label": label,
        "formula": formula,
        "status": status,
        "value": decimal_string(value) if value is not None else None,
        "formatted": f"{currency} {decimal_string(value)}" if value is not None else status,
        "cannot_establish": limitation,
    }


def ratio_metric(metric_id: str, label: str, value: Decimal | None, status: str, formula: str, limitation: str = "") -> dict[str, Any]:
    return {
        "metric_id": metric_id,
        "label": label,
        "formula": formula,
        "status": status,
        "value": decimal_string(value, RATE_QUANTUM) if value is not None else None,
        "formatted": f"{decimal_string(value, Decimal('0.01'))}:1" if value is not None else status,
        "cannot_establish": limitation,
    }


def validate_counts(cohort: dict[str, Any], config: dict[str, Any], path: str, issues: list[dict[str, str]]) -> dict[str, int]:
    raw = cohort.get("counts")
    if not isinstance(raw, dict):
        issues.append(issue("error", "missing_counts", f"{path}.counts", "Counts must be an object."))
        return {}
    counts: dict[str, int] = {}
    allowed = set(config["stages"])
    for key, value in raw.items():
        if key not in allowed:
            issues.append(issue("warning", "unused_count", f"{path}.counts.{key}", "This count is not used for the selected motion."))
            continue
        parsed = to_count(value, f"{path}.counts.{key}", issues)
        if parsed is not None:
            counts[key] = parsed
    if "entries" not in counts:
        issues.append(issue("error", "missing_entries", f"{path}.counts.entries", "An explicit original-entry count is required."))
    stages = config["stages"]
    for earlier, later in zip(stages, stages[1:]):
        if earlier in counts and later in counts and counts[later] > counts[earlier]:
            issues.append(
                issue(
                    "error",
                    "stage_order_conflict",
                    f"{path}.counts.{later}",
                    f"{later} ({counts[later]}) exceeds {earlier} ({counts[earlier]}).",
                    "Correct the unit, definition, deduplication, or source mapping; do not clip the count.",
                )
            )
    return counts


def normalize_evidence_register(cohort: dict[str, Any], path: str, issues: list[dict[str, str]]) -> list[dict[str, Any]]:
    raw = cohort.get("evidence_register", [])
    if not isinstance(raw, list):
        issues.append(issue("warning", "invalid_evidence_register", f"{path}.evidence_register", "Evidence register must be an array."))
        return []
    normalized: list[dict[str, Any]] = []
    for index, row in enumerate(raw):
        row_path = f"{path}.evidence_register[{index}]"
        if not isinstance(row, dict):
            issues.append(issue("warning", "invalid_evidence_record", row_path, "Evidence record must be an object."))
            continue
        missing = [field for field in ("input_name", "basis", "source", "definition") if not str(row.get(field, "")).strip()]
        if missing:
            issues.append(issue("warning", "incomplete_evidence_record", row_path, f"Evidence record is missing: {', '.join(missing)}."))
        normalized.append(
            {
                "input_name": row.get("input_name"),
                "basis": row.get("basis"),
                "source": row.get("source"),
                "location": row.get("location"),
                "period": row.get("period"),
                "extracted_at": row.get("extracted_at"),
                "definition": row.get("definition"),
                "limitation": row.get("limitation"),
            }
        )
    return normalized


def calculate_costs(cohort: dict[str, Any], path: str, issues: list[dict[str, str]], currency: str) -> tuple[Decimal | None, str, list[dict[str, Any]], dict[str, Any]]:
    if "costs" not in cohort:
        return None, "unknown", [], money_metric("total_acquisition_cost", "Fully loaded acquisition cost", None, "unknown", currency, "sum(cost lines)")
    raw_costs = cohort.get("costs")
    if not isinstance(raw_costs, list):
        issues.append(issue("error", "invalid_costs", f"{path}.costs", "Costs must be an array."))
        return None, "unknown", [], money_metric("total_acquisition_cost", "Fully loaded acquisition cost", None, "invalid", currency, "sum(cost lines)")
    cost_boundary = cohort.get("cost_boundary")
    costs_confirmed_complete = cohort.get("costs_confirmed_complete")
    if not isinstance(cost_boundary, str) or not cost_boundary.strip():
        issues.append(issue("warning", "missing_cost_boundary", f"{path}.cost_boundary", "The acquisition-cost boundary is not documented."))
    if costs_confirmed_complete is not True:
        issues.append(issue("warning", "unconfirmed_cost_coverage", f"{path}.costs_confirmed_complete", "The supplied cost ledger is not confirmed complete.", "Confirm coverage or list excluded costs before calling the result fully loaded CAC."))
    seen: set[str] = set()
    normalized: list[dict[str, Any]] = []
    total = Decimal("0")
    bases: list[str] = []
    for index, row in enumerate(raw_costs):
        row_path = f"{path}.costs[{index}]"
        if not isinstance(row, dict):
            issues.append(issue("error", "invalid_cost_line", row_path, "Cost line must be an object."))
            continue
        cost_id = row.get("id")
        if not isinstance(cost_id, str) or not cost_id.strip():
            issues.append(issue("error", "missing_cost_id", f"{row_path}.id", "Cost line requires a unique ID."))
            continue
        if cost_id in seen:
            issues.append(issue("error", "duplicate_cost_id", f"{row_path}.id", f"Duplicate cost ID: {cost_id}."))
            continue
        seen.add(cost_id)
        amount = to_decimal(row.get("amount"), f"{row_path}.amount", issues)
        treatment = row.get("treatment")
        basis = row.get("basis")
        if treatment not in {"direct", "allocated"}:
            issues.append(issue("error", "invalid_cost_treatment", f"{row_path}.treatment", "Use direct or allocated."))
        if basis not in {"actual", "expected", "assumption"}:
            issues.append(issue("error", "invalid_basis", f"{row_path}.basis", "Use actual, expected, or assumption."))
        if treatment == "allocated" and not str(row.get("allocation_method", "")).strip():
            issues.append(issue("error", "missing_allocation_method", f"{row_path}.allocation_method", "Allocated cost requires a reproducible allocation method."))
        if amount is None or treatment not in {"direct", "allocated"} or basis not in {"actual", "expected", "assumption"}:
            continue
        total += amount
        bases.append(basis)
        normalized.append(
            {
                "id": cost_id,
                "category": row.get("category", "unspecified"),
                "amount": decimal_string(amount),
                "treatment": treatment,
                "allocation_method": row.get("allocation_method"),
                "basis": basis,
            }
        )
    basis_status = combine_basis(*bases) if raw_costs else combine_basis(cohort.get("basis"))
    total_metric = money_metric(
        "total_acquisition_cost",
        "Fully loaded acquisition cost" if costs_confirmed_complete is True else "Supplied acquisition cost",
        total,
        basis_status,
        currency,
        "sum(valid cost lines)",
        "Whether excluded or misallocated costs exist outside the supplied ledger.",
    )
    total_metric["cost_boundary"] = cost_boundary
    total_metric["costs_confirmed_complete"] = costs_confirmed_complete is True
    total_metric["excluded_costs"] = cohort.get("excluded_costs")
    return total, basis_status, normalized, total_metric


def calculate_economics(
    cohort: dict[str, Any],
    counts: dict[str, int],
    total_cost: Decimal | None,
    cost_basis: str,
    path: str,
    issues: list[dict[str, str]],
    currency: str,
) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    matured = cohort.get("matured")
    cohort_basis = cohort.get("basis", "unknown")
    entries = counts.get("entries")
    customers = counts.get("customers")
    meetings_held = counts.get("meetings_held")

    if total_cost is None or entries is None:
        output.append(money_metric("cost_per_entry", "Cost per cohort entry", None, "unknown", currency, "acquisition cost / entries"))
    elif entries == 0:
        output.append(money_metric("cost_per_entry", "Cost per cohort entry", None, "not_applicable", currency, "acquisition cost / entries"))
    else:
        output.append(money_metric("cost_per_entry", "Cost per cohort entry", total_cost / Decimal(entries), cost_basis, currency, "acquisition cost / entries", "Entry quality or downstream conversion."))

    cac_value: Decimal | None = None
    cac_status = "unknown"
    if total_cost is not None and customers is not None:
        if customers == 0:
            cac_status = "undefined_zero_customers"
        else:
            cac_value = total_cost / Decimal(customers)
            cac_status = metric_status(combine_basis(cost_basis, cohort_basis), matured, True)
    output.append(money_metric("cac", "Customer acquisition cost", cac_value, cac_status, currency, "acquisition cost / customers", "Customer value, payback speed, or profitability."))

    stage_cost_specs = [
        ("cost_per_positive_engagement", "Cost per relevant engagement entity", "positive_engagements"),
        ("cost_per_qualified_conversation", "Cost per qualified-conversation entity", "qualified_conversations"),
        ("cost_per_booked_meeting_entity", "Cost per booked-meeting entity", "meetings_booked"),
        ("cost_per_held_meeting_entity", "Cost per held-meeting entity", "meetings_held"),
        ("cost_per_qualified_opportunity", "Cost per qualified-opportunity entity", "qualified_opportunities"),
    ]
    for metric_id, label, count_key in stage_cost_specs:
        stage_value = None
        stage_status = "unknown"
        if total_cost is not None and count_key in counts:
            if counts[count_key] == 0:
                stage_status = "not_applicable" if total_cost == 0 else "undefined_zero_stage_entities"
            else:
                stage_value = total_cost / Decimal(counts[count_key])
                stage_status = cost_basis
        output.append(
            money_metric(
                metric_id,
                label,
                stage_value,
                stage_status,
                currency,
                f"acquisition cost / {count_key}",
                "Incremental stage cost, stage quality, or the cause of conversion loss.",
            )
        )

    raw = cohort.get("economics")
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        issues.append(issue("error", "invalid_economics", f"{path}.economics", "Economics must be an object."))
        return output
    economics_basis = raw.get("basis", "unknown")
    if economics_basis not in {"actual", "expected", "assumption", "unknown"}:
        issues.append(issue("error", "invalid_basis", f"{path}.economics.basis", "Use actual, expected, assumption, or omit when unknown."))
        economics_basis = "unknown"

    revenue = None
    delivery_cost = None
    margin = None
    if "first_year_collected_revenue_per_customer" in raw:
        revenue = to_decimal(raw.get("first_year_collected_revenue_per_customer"), f"{path}.economics.first_year_collected_revenue_per_customer", issues)
    if "first_year_direct_delivery_cost_per_customer" in raw:
        delivery_cost = to_decimal(raw.get("first_year_direct_delivery_cost_per_customer"), f"{path}.economics.first_year_direct_delivery_cost_per_customer", issues)
    if "first_year_gross_margin" in raw:
        margin = to_decimal(raw.get("first_year_gross_margin"), f"{path}.economics.first_year_gross_margin", issues)
        if margin is not None and not (Decimal("0") <= margin <= Decimal("1")):
            issues.append(issue("error", "invalid_gross_margin", f"{path}.economics.first_year_gross_margin", "Gross margin must be between 0 and 1."))
            margin = None

    gp_value: Decimal | None = None
    gp_status = "unknown"
    if revenue is not None and delivery_cost is not None:
        gp_value = revenue - delivery_cost
        gp_status = combine_basis(economics_basis)
        if margin is not None:
            margin_gp = revenue * margin
            if abs(gp_value - margin_gp) > MONEY_QUANTUM:
                issues.append(issue("error", "gross_profit_method_conflict", f"{path}.economics", "Direct-cost and gross-margin methods do not reconcile.", "Remove one method or correct the governing inputs."))
                gp_value = None
                gp_status = "invalid"
    elif revenue is not None and margin is not None:
        gp_value = revenue * margin
        gp_status = combine_basis(economics_basis)
    output.append(money_metric("first_year_gross_profit_per_customer", "First-year gross profit per customer", gp_value, gp_status, currency, "collected revenue - direct delivery cost", "Cash timing, acquisition cost, overhead, or net profit."))

    post_cost = None
    if "additional_post_acquisition_cost_per_customer" in raw:
        post_cost = to_decimal(raw.get("additional_post_acquisition_cost_per_customer"), f"{path}.economics.additional_post_acquisition_cost_per_customer", issues)
    contribution: Decimal | None = None
    contribution_status = "unknown"
    horizon = raw.get("contribution_horizon")
    if gp_value is not None and post_cost is not None and isinstance(horizon, str) and horizon.strip():
        contribution = gp_value - post_cost
        contribution_status = gp_status
    elif gp_value is not None and post_cost is not None:
        issues.append(issue("warning", "missing_contribution_horizon", f"{path}.economics.contribution_horizon", "Contribution requires an explicit time horizon."))
    output.append(money_metric("defined_contribution_per_customer", "Defined contribution per customer", contribution, contribution_status, currency, "gross profit in horizon - additional post-acquisition cost", "Whether any cost was double counted or omitted."))
    output[-1]["horizon"] = horizon

    held_gp_value: Decimal | None = None
    held_gp_status = "unknown"
    if gp_value is not None and customers is not None and meetings_held is not None:
        if meetings_held == 0:
            held_gp_status = "not_applicable"
        elif customers <= meetings_held:
            held_gp_value = gp_value * Decimal(customers) / Decimal(meetings_held)
            held_gp_status = metric_status(combine_basis(cohort_basis, economics_basis), matured, True)
        else:
            held_gp_status = "invalid"
    output.append(money_metric("first_year_gross_profit_per_held_meeting", "First-year gross profit per held-meeting entity", held_gp_value, held_gp_status, currency, "gross profit/customer * customers / held-meeting entities", "An allowable meeting price or net profit."))

    first_year_coverage = None
    first_year_coverage_status = "unknown"
    if gp_value is not None and cac_value is not None:
        if cac_value == 0:
            first_year_coverage_status = "not_applicable"
        else:
            first_year_coverage = gp_value / cac_value
            first_year_coverage_status = combine_basis(gp_status, cac_status)
    output.append(
        ratio_metric(
            "first_year_gross_profit_cac_coverage",
            "First-year gross-profit coverage of CAC",
            first_year_coverage,
            first_year_coverage_status,
            "first-year gross profit per customer / CAC",
            "Lifetime value, cash payback, ROI, or net profit.",
        )
    )

    cohort_contribution = None
    cohort_contribution_status = "unknown"
    if gp_value is not None and customers is not None and total_cost is not None:
        cohort_contribution = gp_value * Decimal(customers) - total_cost
        cohort_contribution_status = metric_status(combine_basis(gp_status, cohort_basis, cost_basis), matured, True)
    output.append(
        money_metric(
            "first_year_cohort_gross_contribution_after_acquisition",
            "First-year cohort gross contribution after acquisition cost",
            cohort_contribution,
            cohort_contribution_status,
            currency,
            "gross profit/customer * customers - acquisition cost",
            "Net profit, realized cash profit, overhead, tax, financing, or omitted costs.",
        )
    )

    lifetime_revenue = None
    lifetime_cost = None
    if "lifetime_collected_revenue_per_customer" in raw:
        lifetime_revenue = to_decimal(raw.get("lifetime_collected_revenue_per_customer"), f"{path}.economics.lifetime_collected_revenue_per_customer", issues)
    if "lifetime_direct_delivery_cost_per_customer" in raw:
        lifetime_cost = to_decimal(raw.get("lifetime_direct_delivery_cost_per_customer"), f"{path}.economics.lifetime_direct_delivery_cost_per_customer", issues)
    lifetime_gp = lifetime_revenue - lifetime_cost if lifetime_revenue is not None and lifetime_cost is not None else None
    output.append(money_metric("lifetime_gross_profit_per_customer", "Lifetime gross profit per customer", lifetime_gp, combine_basis(economics_basis) if lifetime_gp is not None else "unknown", currency, "lifetime collected revenue - lifetime direct delivery cost", "Retention reliability, cash timing, or net profit."))
    ltv_cac_value = None
    ltv_cac_status = "unknown"
    if lifetime_gp is not None and cac_value is not None:
        if cac_value == 0:
            ltv_cac_status = "not_applicable"
        else:
            ltv_cac_value = lifetime_gp / cac_value
            ltv_cac_status = combine_basis(economics_basis, cac_status)
    output.append(ratio_metric("gross_profit_ltv_cac", "Gross-profit LTV:CAC", ltv_cac_value, ltv_cac_status, "lifetime gross profit / CAC", "Payback speed, cash capacity, or a universal acceptable threshold."))

    exact_payback_value: int | None = None
    exact_payback_status = "unknown"
    cumulative_at_payback: Decimal | None = None
    series = raw.get("monthly_gross_profit_per_customer")
    if series is not None:
        if not isinstance(series, list):
            issues.append(issue("error", "invalid_payback_series", f"{path}.economics.monthly_gross_profit_per_customer", "Monthly gross-profit series must be an array."))
        elif cac_value is not None:
            cumulative = Decimal("0")
            valid_series = True
            for index, value in enumerate(series):
                month_gp = to_decimal(value, f"{path}.economics.monthly_gross_profit_per_customer[{index}]", issues, allow_negative=True)
                if month_gp is None:
                    valid_series = False
                    continue
                cumulative += month_gp
                if exact_payback_value is None and cumulative >= cac_value:
                    exact_payback_value = index + 1
                    cumulative_at_payback = cumulative
            if valid_series:
                exact_payback_status = combine_basis(economics_basis, cac_status) if exact_payback_value is not None else "not_recovered_within_series"
    output.append(
        {
            "metric_id": "exact_cac_payback_month",
            "label": "Exact CAC payback month",
            "formula": "first month cumulative gross profit >= CAC",
            "status": exact_payback_status,
            "value": exact_payback_value,
            "formatted": f"month {exact_payback_value}" if exact_payback_value is not None else exact_payback_status,
            "cumulative_gross_profit_at_payback": decimal_string(cumulative_at_payback) if cumulative_at_payback is not None else None,
            "cannot_establish": "Cash payback unless the series uses cash collections and cash costs.",
        }
    )

    stable_gp = None
    if "stable_monthly_gross_profit_per_customer" in raw:
        stable_gp = to_decimal(raw.get("stable_monthly_gross_profit_per_customer"), f"{path}.economics.stable_monthly_gross_profit_per_customer", issues)
    simple_value = None
    simple_status = "unknown"
    if stable_gp is not None and cac_value is not None:
        if stable_gp == 0:
            simple_status = "not_applicable"
        else:
            simple_value = cac_value / stable_gp
            simple_status = combine_basis(economics_basis, cac_status)
    simple_metric = ratio_metric("simplified_cac_payback_months", "Simplified CAC payback", simple_value, simple_status, "CAC / stable monthly gross profit", "Exact payback when monthly gross profit is not stable; cash payback without cash-basis inputs.")
    if simple_value is not None:
        simple_metric["formatted"] = f"{decimal_string(simple_value, Decimal('0.01'))} months"
    output.append(simple_metric)

    break_even_count: int | None = None
    continuous_rate: Decimal | None = None
    operational_rate: Decimal | None = None
    break_even_status = "unknown"
    if total_cost is not None and contribution is not None:
        if total_cost > 0 and contribution <= 0:
            break_even_status = "economically_impossible"
        elif contribution > 0:
            break_even_count = int((total_cost / contribution).to_integral_value(rounding=ROUND_CEILING))
            break_even_status = combine_basis(cost_basis, contribution_status)
            if entries is not None and entries > 0:
                continuous_rate = (total_cost / Decimal(entries)) / contribution
                operational_rate = Decimal(break_even_count) / Decimal(entries)
                if continuous_rate > 1 or break_even_count > entries:
                    break_even_status = "economically_impossible"
        elif total_cost == 0:
            break_even_count = 0
            break_even_status = combine_basis(cost_basis, contribution_status)
    output.append(
        {
            "metric_id": "break_even_customers",
            "label": "Break-even customers",
            "formula": "ceiling(acquisition cost / defined contribution per customer)",
            "status": break_even_status,
            "value": break_even_count,
            "formatted": str(break_even_count) if break_even_count is not None else break_even_status,
            "horizon": horizon,
            "cannot_establish": "The likelihood of acquiring the required customers.",
        }
    )
    output.append(
        {
            "metric_id": "required_customer_rate",
            "label": "Continuous required customer rate",
            "formula": "cost per entry / defined contribution per customer",
            "status": break_even_status if continuous_rate is not None else ("unknown" if break_even_status != "economically_impossible" else break_even_status),
            "value": decimal_string(continuous_rate, RATE_QUANTUM) if continuous_rate is not None else None,
            "formatted": percent_string(continuous_rate) if continuous_rate is not None else break_even_status,
            "whole_customer_operational_rate": percent_string(operational_rate) if operational_rate is not None else None,
            "horizon": horizon,
            "cannot_establish": "Predicted customer conversion.",
        }
    )
    return output


def calculate_cohort(cohort: Any, index: int, currency: str) -> dict[str, Any]:
    path = f"cohorts[{index}]"
    issues: list[dict[str, str]] = []
    if not isinstance(cohort, dict):
        return {"cohort_id": None, "status": "invalid", "issues": [issue("error", "invalid_cohort", path, "Cohort must be an object.")]}
    cohort_id = cohort.get("cohort_id")
    if not isinstance(cohort_id, str) or not cohort_id.strip():
        issues.append(issue("error", "missing_cohort_id", f"{path}.cohort_id", "A non-empty cohort ID is required."))
    motion = cohort.get("motion")
    if motion not in MOTION_CONFIG:
        issues.append(issue("error", "unsupported_motion", f"{path}.motion", "Use cold_email, linkedin, or named_account."))
        config = MOTION_CONFIG["cold_email"]
    else:
        config = MOTION_CONFIG[motion]
    basis = cohort.get("basis")
    if basis not in {"actual", "expected", "assumption"}:
        issues.append(issue("error", "invalid_basis", f"{path}.basis", "Use actual, expected, or assumption."))
        basis = "unknown"
    matured = cohort.get("matured")
    if matured not in {True, False, None}:
        issues.append(issue("error", "invalid_maturity", f"{path}.matured", "Use true, false, or null."))
        matured = None
    for field in ("entry_definition", "definition_version", "attribution_window"):
        if not isinstance(cohort.get(field), str) or not cohort.get(field, "").strip():
            issues.append(issue("error", f"missing_{field}", f"{path}.{field}", f"{field} is required."))
    if motion == "linkedin" and isinstance(cohort.get("counts"), dict) and "reached" in cohort["counts"]:
        definitions = cohort.get("definitions", {})
        if not isinstance(definitions, dict) or not str(definitions.get("reached", "")).strip():
            issues.append(issue("error", "missing_linkedin_reach_definition", f"{path}.definitions.reached", "A LinkedIn reach count requires the exact reach event definition."))

    requested = cohort.get("requested_analyses", ["funnel"])
    allowed_analyses = {"funnel", "cac", "customer_economics", "break_even", "payback"}
    if not isinstance(requested, list) or not requested or any(item not in allowed_analyses for item in requested):
        issues.append(issue("error", "invalid_requested_analyses", f"{path}.requested_analyses", "Use one or more of funnel, cac, customer_economics, break_even, or payback."))
        requested = ["funnel"]

    counts = validate_counts(cohort, config, path, issues)
    evidence_register = normalize_evidence_register(cohort, path, issues)
    funnel_metrics = [rate_metric(mid, label, num, den, counts, basis, matured) for mid, num, den, label in config["metrics"] + COMMON_METRICS]
    total_cost, cost_basis, costs, total_cost_metric = calculate_costs(cohort, path, issues, currency)
    economics = [total_cost_metric] + calculate_economics(cohort, counts, total_cost, cost_basis, path, issues, currency)

    has_errors = any(item["severity"] == "error" for item in issues)
    requested_metric_ids: set[str] = set()
    if "funnel" in requested:
        requested_metric_ids.update(metric[0] for metric in config["metrics"] + COMMON_METRICS)
    if "cac" in requested:
        requested_metric_ids.update({"total_acquisition_cost", "cost_per_entry", "cac"})
    if "customer_economics" in requested:
        requested_metric_ids.update({"first_year_gross_profit_per_customer", "first_year_gross_profit_per_held_meeting", "first_year_gross_profit_cac_coverage", "first_year_cohort_gross_contribution_after_acquisition", "lifetime_gross_profit_per_customer", "gross_profit_ltv_cac"})
    if "break_even" in requested:
        requested_metric_ids.update({"defined_contribution_per_customer", "break_even_customers", "required_customer_rate"})
    requested_metrics = [item for item in funnel_metrics + economics if item.get("metric_id") in requested_metric_ids]
    unknowns = sum(1 for item in requested_metrics if item.get("status") == "unknown")
    if "payback" in requested:
        payback_metrics = [item for item in economics if item.get("metric_id") in {"exact_cac_payback_month", "simplified_cac_payback_months"}]
        if not any(item.get("status") not in {"unknown", "invalid"} for item in payback_metrics):
            unknowns += 1
    if has_errors:
        status = "invalid"
    elif basis == "actual" and any(item.get("status") == "provisional" for item in requested_metrics):
        status = "provisional"
    elif unknowns or any(item["severity"] == "warning" and item["code"] in {"missing_cost_boundary", "unconfirmed_cost_coverage", "missing_contribution_horizon"} for item in issues):
        status = "partial"
    else:
        status = "complete"
    return {
        "cohort_id": cohort_id,
        "name": cohort.get("name", cohort_id),
        "status": status,
        "motion": motion,
        "unit": config["unit"],
        "basis": basis,
        "requested_analyses": requested,
        "matured": matured,
        "period": cohort.get("period"),
        "analysis_date": cohort.get("analysis_date"),
        "entry_definition": cohort.get("entry_definition"),
        "definition_version": cohort.get("definition_version"),
        "attribution_window": cohort.get("attribution_window"),
        "win_definition": cohort.get("win_definition"),
        "counts": counts,
        "count_labels": config["labels"],
        "evidence_register": evidence_register,
        "normalization_notes": cohort.get("normalization_notes", []),
        "known_unknowns": cohort.get("known_unknowns", []),
        "cost_ledger": costs,
        "funnel_metrics": funnel_metrics,
        "economic_metrics": economics,
        "issues": issues,
    }


def metric_map(cohort_result: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {m["metric_id"]: m for m in cohort_result.get("funnel_metrics", []) + cohort_result.get("economic_metrics", [])}


def calculate_comparisons(raw: Any, cohort_results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if raw is None:
        return []
    if not isinstance(raw, list):
        return [{"status": "invalid", "issues": [issue("error", "invalid_comparisons", "comparisons", "Comparisons must be an array.")]}]
    by_id = {item.get("cohort_id"): item for item in cohort_results}
    output: list[dict[str, Any]] = []
    for index, spec in enumerate(raw):
        path = f"comparisons[{index}]"
        problems: list[dict[str, str]] = []
        if not isinstance(spec, dict):
            output.append({"status": "invalid", "issues": [issue("error", "invalid_comparison", path, "Comparison must be an object.")]})
            continue
        baseline = by_id.get(spec.get("baseline_cohort_id"))
        candidate = by_id.get(spec.get("candidate_cohort_id"))
        if baseline is None or candidate is None:
            problems.append(issue("error", "unknown_cohort", path, "Baseline or candidate cohort ID was not found."))
        comparable = True
        checks: list[dict[str, Any]] = []
        if baseline and candidate:
            for field in ("motion", "unit", "definition_version", "attribution_window", "matured"):
                same = baseline.get(field) == candidate.get(field)
                checks.append({"condition": field, "baseline": baseline.get(field), "candidate": candidate.get(field), "comparable": same})
                comparable = comparable and same
            if baseline.get("status") == "invalid" or candidate.get("status") == "invalid":
                comparable = False
                problems.append(issue("error", "invalid_source_cohort", path, "At least one cohort is invalid."))
        deltas: list[dict[str, Any]] = []
        if comparable and baseline and candidate:
            base_metrics = metric_map(baseline)
            candidate_metrics = metric_map(candidate)
            for metric_id in sorted(set(base_metrics) & set(candidate_metrics)):
                base_metric = base_metrics[metric_id]
                candidate_metric = candidate_metrics[metric_id]
                if base_metric.get("value") is None or candidate_metric.get("value") is None:
                    continue
                try:
                    base_value = Decimal(str(base_metric["value"]))
                    candidate_value = Decimal(str(candidate_metric["value"]))
                except InvalidOperation:
                    continue
                absolute = candidate_value - base_value
                relative = None if base_value == 0 else absolute / base_value
                deltas.append(
                    {
                        "metric_id": metric_id,
                        "baseline": str(base_metric["value"]),
                        "candidate": str(candidate_metric["value"]),
                        "absolute_delta": decimal_string(absolute, RATE_QUANTUM),
                        "relative_delta": decimal_string(relative, RATE_QUANTUM) if relative is not None else None,
                        "interpretation": "Measured change only; cause is not established.",
                    }
                )
        output.append(
            {
                "comparison_id": spec.get("comparison_id", f"comparison-{index + 1}"),
                "status": "complete" if comparable else "invalid",
                "comparable": comparable,
                "checks": checks,
                "deltas": deltas,
                "issues": problems,
            }
        )
    return output


def calculate_expansion_scenarios(raw: Any, cohort_results: list[dict[str, Any]], currency: str) -> list[dict[str, Any]]:
    if raw is None:
        return []
    if not isinstance(raw, list):
        return [{"status": "invalid", "issues": [issue("error", "invalid_scenarios", "expansion_scenarios", "Expansion scenarios must be an array.")]}]
    cohort_ids = {item.get("cohort_id") for item in cohort_results}
    output: list[dict[str, Any]] = []
    for index, scenario in enumerate(raw):
        path = f"expansion_scenarios[{index}]"
        problems: list[dict[str, str]] = []
        if not isinstance(scenario, dict):
            output.append({"status": "invalid", "issues": [issue("error", "invalid_scenario", path, "Scenario must be an object.")]})
            continue
        basis = scenario.get("basis")
        if basis not in {"expected", "assumption"}:
            problems.append(issue("error", "invalid_basis", f"{path}.basis", "Expansion inputs must be expected or assumption."))
        if scenario.get("baseline_cohort_id") not in cohort_ids:
            problems.append(issue("error", "unknown_cohort", f"{path}.baseline_cohort_id", "Baseline cohort ID was not found."))
        additional_cost = to_decimal(scenario.get("additional_cost"), f"{path}.additional_cost", problems)
        additional_customers = to_decimal(scenario.get("expected_additional_customers"), f"{path}.expected_additional_customers", problems)
        contribution = to_decimal(scenario.get("expected_contribution_per_customer"), f"{path}.expected_contribution_per_customer", problems, allow_negative=True)
        horizon = scenario.get("contribution_horizon")
        if not isinstance(horizon, str) or not horizon.strip():
            problems.append(issue("error", "missing_contribution_horizon", f"{path}.contribution_horizon", "A contribution horizon is required."))
        gross = None
        net = None
        required = None
        status = "invalid" if any(p["severity"] == "error" for p in problems) else basis
        if status != "invalid" and additional_cost is not None and additional_customers is not None and contribution is not None:
            gross = additional_customers * contribution
            net = gross - additional_cost
            if additional_cost > 0 and contribution <= 0:
                status = "economically_impossible"
            elif contribution > 0:
                required = int((additional_cost / contribution).to_integral_value(rounding=ROUND_CEILING))
        output.append(
            {
                "scenario_id": scenario.get("scenario_id", f"scenario-{index + 1}"),
                "status": status,
                "basis": basis,
                "contribution_horizon": horizon,
                "additional_cost": f"{currency} {decimal_string(additional_cost)}" if additional_cost is not None else None,
                "expected_additional_customers": decimal_string(additional_customers, RATE_QUANTUM) if additional_customers is not None else None,
                "expected_contribution_per_customer": f"{currency} {decimal_string(contribution)}" if contribution is not None else None,
                "additional_gross_contribution": f"{currency} {decimal_string(gross)}" if gross is not None else None,
                "net_incremental_contribution": f"{currency} {decimal_string(net)}" if net is not None else None,
                "required_additional_customers": required,
                "limitation": "Scenario arithmetic does not authorize spend or predict incremental customers.",
                "issues": problems,
            }
        )
    return output


def calculate_document(data: Any) -> dict[str, Any]:
    if not isinstance(data, dict):
        return {"calculation_version": CALCULATION_VERSION, "status": "invalid", "issues": [issue("error", "invalid_document", "$", "Input must be a JSON object.")]}
    document_issues: list[dict[str, str]] = []
    if data.get("schema_version") != SUPPORTED_SCHEMA_VERSION:
        document_issues.append(issue("error", "unsupported_schema_version", "schema_version", f"Use schema version {SUPPORTED_SCHEMA_VERSION}."))
    currency = data.get("currency", "USD")
    if not isinstance(currency, str) or not currency.strip():
        document_issues.append(issue("error", "invalid_currency", "currency", "Currency must be a non-empty code or label."))
        currency = "USD"
    raw_cohorts = data.get("cohorts")
    if not isinstance(raw_cohorts, list) or not raw_cohorts:
        document_issues.append(issue("error", "missing_cohorts", "cohorts", "Provide at least one cohort."))
        raw_cohorts = []
    cohort_results = [calculate_cohort(cohort, index, currency) for index, cohort in enumerate(raw_cohorts)]
    ids = [item.get("cohort_id") for item in cohort_results if item.get("cohort_id")]
    for duplicate_id in sorted({item for item in ids if ids.count(item) > 1}):
        document_issues.append(issue("error", "duplicate_cohort_id", "cohorts", f"Duplicate cohort ID: {duplicate_id}."))
    comparisons = calculate_comparisons(data.get("comparisons"), cohort_results)
    scenarios = calculate_expansion_scenarios(data.get("expansion_scenarios"), cohort_results, currency)
    canonical = json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    fingerprint = hashlib.sha256(canonical).hexdigest()
    has_error = any(i["severity"] == "error" for i in document_issues) or any(c.get("status") == "invalid" for c in cohort_results) or any(c.get("status") == "invalid" for c in comparisons) or any(s.get("status") == "invalid" for s in scenarios)
    if has_error:
        status = "invalid"
    elif any(c.get("status") == "provisional" for c in cohort_results):
        status = "provisional"
    elif any(c.get("status") == "partial" for c in cohort_results):
        status = "partial"
    else:
        status = "complete"
    return {
        "calculation_version": CALCULATION_VERSION,
        "schema_version": data.get("schema_version"),
        "input_fingerprint_sha256": fingerprint,
        "currency": currency,
        "status": status,
        "issues": document_issues,
        "cohorts": cohort_results,
        "comparisons": comparisons,
        "expansion_scenarios": scenarios,
    }


def escape_cell(value: Any) -> str:
    return str(value if value is not None else "").replace("|", "\\|").replace("\n", " ")


def render_markdown(result: dict[str, Any]) -> str:
    lines = ["# Outbound Funnel & Economics Audit", "", f"**Status:** {str(result.get('status', 'invalid')).upper()}", f"**Calculation version:** {result.get('calculation_version')}", f"**Input fingerprint:** `{result.get('input_fingerprint_sha256', 'unavailable')}`", ""]
    if result.get("issues"):
        lines.extend(["## Document issues", ""])
        for item in result["issues"]:
            lines.append(f"- **{item['severity'].upper()} — {item['code']}:** {item['message']} (`{item['path']}`)")
        lines.append("")
    for cohort in result.get("cohorts", []):
        lines.extend(
            [
                f"## {cohort.get('name') or cohort.get('cohort_id') or 'Invalid cohort'}",
                "",
                f"**State:** {str(cohort.get('status', 'invalid')).upper()}  ",
                f"**Motion and unit:** {cohort.get('motion')} — {cohort.get('unit')}  ",
                f"**Basis and maturity:** {cohort.get('basis')} — matured: {cohort.get('matured')}  ",
                f"**Requested analyses:** {', '.join(cohort.get('requested_analyses', []))}  ",
                f"**Entry definition:** {cohort.get('entry_definition')}  ",
                f"**Definition version:** {cohort.get('definition_version')}  ",
                f"**Attribution window:** {cohort.get('attribution_window')}",
                "",
            ]
        )
        if cohort.get("issues"):
            lines.extend(["### Data-quality and reconciliation findings", ""])
            for item in cohort["issues"]:
                remedy = f" Remedy: {item['remedy']}" if item.get("remedy") else ""
                lines.append(f"- **{item['severity'].upper()} — {item['code']}:** {item['message']}{remedy}")
            lines.append("")
        if cohort.get("evidence_register"):
            lines.extend(["### Evidence register", "", "| Input | Basis | Source | Definition | Limitation |", "|---|---|---|---|---|"])
            for record in cohort["evidence_register"]:
                lines.append(
                    "| " + " | ".join(
                        escape_cell(value)
                        for value in (record.get("input_name"), record.get("basis"), record.get("source"), record.get("definition"), record.get("limitation"))
                    ) + " |"
                )
            lines.append("")
        lines.extend(["### Funnel", "", "| Metric | Numerator | Denominator | Result | Status | Meaning | Investigate next | What it cannot establish |", "|---|---:|---:|---:|---|---|---|---|"])
        for metric in cohort.get("funnel_metrics", []):
            lines.append(
                "| " + " | ".join(
                    escape_cell(value)
                    for value in (
                        metric.get("label"),
                        metric.get("numerator", "unknown"),
                        metric.get("denominator", "unknown"),
                        metric.get("formatted"),
                        metric.get("status"),
                        metric.get("meaning"),
                        metric.get("investigate_next"),
                        metric.get("cannot_establish"),
                    )
                ) + " |"
            )
        lines.extend(["", "### Economics", "", "| Metric | Formula | Result | Status | Horizon/limitation |", "|---|---|---:|---|---|"])
        for metric in cohort.get("economic_metrics", []):
            whole_rate = metric.get("whole_customer_operational_rate")
            detail = "; ".join(value for value in (str(metric.get("horizon", "")).strip(), f"whole-customer threshold: {whole_rate}" if whole_rate else "", str(metric.get("cannot_establish", "")).strip()) if value)
            lines.append(
                "| " + " | ".join(
                    escape_cell(value)
                    for value in (metric.get("label"), metric.get("formula"), metric.get("formatted"), metric.get("status"), detail)
                ) + " |"
            )
        lines.extend(["", "### Investigation boundary", ""])
        lines.append("Rates identify observed transitions. They do not establish cause. Review the underlying records named in each metric before changing the system.")
        lines.append("")
    if result.get("comparisons"):
        lines.extend(["## Cohort comparisons", ""])
        for comparison in result["comparisons"]:
            lines.append(f"### {comparison.get('comparison_id')} — {str(comparison.get('status')).upper()}")
            lines.append("")
            if not comparison.get("comparable"):
                lines.append("The comparability gate failed. Do not interpret rate or economic differences as like-for-like performance.")
            else:
                lines.append("Deltas show measured change only; they do not establish cause.")
            lines.append("")
    if result.get("expansion_scenarios"):
        lines.extend(["## Marginal expansion scenarios", ""])
        for scenario in result["expansion_scenarios"]:
            lines.extend(
                [
                    f"### {scenario.get('scenario_id')} — {str(scenario.get('status')).upper()}",
                    "",
                    f"- Additional cost: {scenario.get('additional_cost')}",
                    f"- Expected additional customers: {scenario.get('expected_additional_customers')}",
                    f"- Expected contribution per customer: {scenario.get('expected_contribution_per_customer')}",
                    f"- Additional gross contribution: {scenario.get('additional_gross_contribution')}",
                    f"- Net incremental contribution: {scenario.get('net_incremental_contribution')}",
                    f"- Required additional customers: {scenario.get('required_additional_customers')}",
                    f"- Limitation: {scenario.get('limitation')}",
                    "",
                ]
            )
    return "\n".join(lines).rstrip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Calculate and audit outbound funnel and economics metrics.")
    parser.add_argument("--input", required=True, help="Path to normalized JSON input, or - for stdin.")
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        raw = sys.stdin.read() if args.input == "-" else Path(args.input).read_text(encoding="utf-8")
        data = json.loads(raw)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Input error: {exc}", file=sys.stderr)
        return 2
    result = calculate_document(data)
    if args.format == "json":
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(render_markdown(result), end="")
    return 1 if result.get("status") == "invalid" else 0


if __name__ == "__main__":
    raise SystemExit(main())
