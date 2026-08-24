import type { Metadata } from "next";
import { AppointmentSettingIndustryPage } from "@/components/appointment-setting-industry-page";

export const metadata: Metadata = {
  title: "Healthcare Staffing Appointment Setting | Muditek",
  description: "Direct facility meetings for healthcare staffing agencies. €500–€900 monthly operating cost plus €250–€350 per qualified meeting held.",
  alternates: { canonical: "https://muditek.com/appointment-setting/healthcare-staffing" },
};

export default function HealthcareStaffingAppointmentSettingPage() {
  return (
    <AppointmentSettingIndustryPage
      slug="healthcare-staffing"
      market="Healthcare staffing"
      headline="Facility meetings for staffing agencies building direct accounts."
      intro="Muditek uses public workforce signals to prioritize facilities in your specialty and geography, reaches the right workforce or hiring contact, and screens the reply before it reaches your calendar."
      buyer="Small and mid-sized healthcare staffing agencies that want direct facility relationships. This does not fit an agency that only needs more candidates inside locked MSP or VMS accounts."
      target="Hospitals, care facilities, clinics, and other approved healthcare employers with contingent clinical staffing needs."
      signals={[
        "Live roles in the agency's approved specialty and geography.",
        "Repeated hiring activity for the same clinical roles.",
        "A publicly announced new facility, service line, or specialty expansion.",
        "Published vacancies or staffing data inside the agency's approved specialty.",
      ]}
      qualification={[
        "The facility type, geography, specialty, and hiring role match the approved rules.",
        "The facility has a live role the staffing desk covers.",
        "The attendee owns or materially influences the relevant staffing decision.",
        "The attendee joins for at least 15 minutes.",
        "Existing relationships, MSP-only accounts, vendors, and recent duplicates are excluded.",
      ]}
      operatingCost="€500–€900 per month"
      meetingFee="€250–€350 per qualified meeting held"
      pricingNote="The operating cost is set after the target geography, specialties, data requirements, and sending infrastructure are defined."
    />
  );
}
