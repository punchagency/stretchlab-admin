import { PricingCard } from "./PricingCard";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  title: string;
  description: string;
  price: number;
  features: PricingFeature[];
  buttonText?: string;
  onButtonClick?: () => void;
  billingPeriod?: string;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  className?: string;
}

export const PricingSection = ({ plans, className = "" }: PricingSectionProps) => {
  return (
    <div className={`w-full xl:w-1/2 flex justify-center items-center ${className} py-6`}>
      <div className="w-full">
        <div className={`grid grid-cols-1 ${plans.length > 2 ? 'xl:grid-cols-3' : 'xl:grid-cols-1'} gap-6`}>
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              // buttonText={plan.buttonText}
              // onButtonClick={plan.onButtonClick}
              // buttonVariant={plan.buttonVariant}
              billingPeriod={plan.billingPeriod}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
