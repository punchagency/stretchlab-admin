export interface PricingFeature {
  text: string;
}

export interface PricingPlan {
  title: string;
  description: string;
  price: number;
  features: PricingFeature[];
  buttonText?: string;
  onButtonClick?: () => void;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  billingPeriod?: string;
}

export const pricingPlans: PricingPlan[] = [

  {
    title: "StretchNote Insights",
    description: "Your AI-powered quality control system for stretch session documentation.",
    price: 29,
    features: [
      { text: "Auditing session notes" },
      { text: "Flagging unlogged bookings" },
      { text: "Identifying coaching opportunities across your team" },
      { text: "Actionable, drill-down reporting by location and staff member" },
      { text: "Elevated accountability, session quality, and business performance" }
    ],
    buttonText: "Start trial",
    onButtonClick: () => console.log("Start trial for StretchNote Insights"),
    buttonVariant: "primary",
    billingPeriod: "per month / per studio"
  },
  {
    title: "StretchNote Capture",
    description: "Helps Flexologists create high-quality, organized client notes in less time",
    price: 7,
    features: [
      { text: "Faster Note Entry: Use tap-to-dictate or type" },
      { text: "Smart Formatting: Notes are automatically organized for clarity and consistency" },
      { text: "Schedule: List of upcoming client sessions" },
      { text: "Historical Notes: View past client session notes to prep and personalize" },
      { text: "One-Click Submission: Finalized notes are posted to Club Ready" },
      { text: "Auto Log-Off: Session logged as complete in Club Ready" }
    ],
    buttonText: "Subscribe",
    onButtonClick: () => console.log("Subscribe to StretchNote Capture"),
    buttonVariant: "primary",
     billingPeriod: "per month / per flexologist"
  },
];
