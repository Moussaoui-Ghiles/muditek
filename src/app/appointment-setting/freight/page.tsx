import type { Metadata } from "next";
import { AppointmentSettingIndustryPage } from "@/components/appointment-setting-industry-page";

export const metadata: Metadata = {
  title: "Freight Broker Appointment Setting | Muditek",
  description: "Shipper meetings matched to your modes, lanes, and geography. €500–€900 monthly operating cost plus €250–€350 per qualified meeting held.",
  alternates: { canonical: "https://muditek.com/appointment-setting/freight" },
};

export default function FreightAppointmentSettingPage() {
  return (
    <AppointmentSettingIndustryPage
      slug="freight"
      market="Freight and logistics"
      headline="Shipper meetings matched to the freight you can actually move."
      intro="Muditek maps your modes, lanes, geography, and account exclusions, then prioritizes shippers with public signs of freight change before starting outreach."
      buyer="Freight brokers and 3PLs with defined modes, lanes, geographies, and capacity to serve a new shipper."
      target="Manufacturers, distributors, retailers, and other approved shippers with freight in the lanes the brokerage can serve."
      signals={[
        "A new facility, warehouse, or distribution footprint.",
        "Hiring for logistics, transportation, or supply-chain roles.",
        "A publicly announced expansion into new regions or routes.",
        "A public carrier, logistics, or transportation procurement notice.",
      ]}
      qualification={[
        "The shipper, geography, mode, and lane match the approved rules.",
        "The attendee owns or materially influences the freight decision.",
        "The shipper has real freight in a lane the broker serves.",
        "The attendee joins for at least 15 minutes.",
        "Existing accounts, active opportunities, vendors, and recent duplicates are excluded.",
      ]}
      operatingCost="€500–€900 per month"
      meetingFee="€250–€350 per qualified meeting held"
      pricingNote="The operating cost is set after the lanes, shipper profile, data requirements, and sending infrastructure are defined."
    />
  );
}
