interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  features: PricingFeature[];
  className?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const PricingCard = ({ 
  title, 
  description, 
  price, 
  features, 
  className = "",
  buttonText,
  onButtonClick,
}: PricingCardProps) => {


  return (
    <div className={`bg-white rounded-lg p-6 shadow-[0_0_10px_rgba(0,0,0,0.1)] ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-xs leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="text-center mb-4">
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-primary-base">${price}</span>
          <span className="text-gray-600 ml-1 text-sm">per month</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <h4 className="font-semibold text-gray-800 text-xs">This includes:</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 text-xs">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 bg-primary-base text-white hover:bg-primary-base/80"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
