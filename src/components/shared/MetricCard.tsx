import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "success" | "warning";
  onButtonClick?: () => void;
  showCurrency?: boolean;
  tooltip?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  buttonText,
  buttonVariant = "primary",
  onButtonClick,
  showCurrency = false,
  tooltip,
}: MetricCardProps) => {
  const getButtonClasses = () => {
    switch (buttonVariant) {
      case "primary":
        return "bg-primary-base text-white hover:bg-primary-base/80";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "success":
        return "bg-green-500 text-white hover:bg-green-600";
      case "warning":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      default:
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {tooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-sm font-medium text-gray-600 cursor-help">
                  {title}
                </h3>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] text-center">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          ) : (
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          )}
        </div>
        {showCurrency && <span className="text-lg font-semibold">$</span>}
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>

      {buttonText && <button
        onClick={onButtonClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${getButtonClasses()}`}
      >
        {buttonText}
      </button>}
    </div>
  );
}; 