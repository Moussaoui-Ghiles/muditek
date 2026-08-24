import type { Metadata } from "next";
import { AppointmentSettingIndustryPage } from "@/components/appointment-setting-industry-page";

export const metadata: Metadata = {
  title: "M&A Owner Appointment Setting | Muditek",
  description: "Signal-prioritized owner outreach for business brokers, M&A advisors, search funds, and small PE firms. $900 monthly plus $500 per qualified meeting held.",
  alternates: { canonical: "https://muditek.com/appointment-setting/ma" },
};

export default function MaAppointmentSettingPage() {
  return (
    <AppointmentSettingIndustryPage
      slug="ma"
      market="M&A owner outreach"
      headline="Owner meetings for the buy box you can actually pursue."
      intro="Muditek builds the company universe, prioritizes it with public owner and succession signals, contacts the owner, and books only after the owner confirms that a transaction conversation may be relevant."
      buyer="Business brokers, M&A advisors, search funds, and small private-equity firms with a defined acquisition or sell-side mandate."
      target="Private-company owners who match the approved industry, geography, size, and ownership profile."
      signals={[
        "Long owner tenure and an established company age.",
        "A public leadership page that names no successor or second management layer.",
        "A recent first operations or general-management hire.",
        "Public language about slowing down, retirement, succession, valuation, or the future of the business.",
      ]}
      qualification={[
        "The company fits the approved buy box or sell-side mandate.",
        "The attendee is the owner or the person authorized to discuss a transaction.",
        "The owner has confirmed that a possible transaction and its time horizon are relevant enough to discuss.",
        "The owner attends for at least 15 minutes.",
        "Existing relationships, active opportunities, sold companies, and recent duplicates are excluded.",
      ]}
      operatingCost="$900 per month"
      meetingFee="$500 per qualified meeting held"
      pricingNote="This M&A price applies only to the M&A service. The general B2B price does not apply here."
    />
  );
}
