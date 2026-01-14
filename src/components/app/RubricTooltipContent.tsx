import { Check } from "lucide-react";

interface RubricTooltipContentProps {
    isFirstTimer: boolean;
    opportunities: string[];
}

export const RubricTooltipContent = ({ isFirstTimer, opportunities }: RubricTooltipContentProps) => {
    const firstVisitItems = [
        "Confirmation Call",
        "Grip Sock Notice",
        "Arrive Early",
        "Location",
        "Prepaid",
        "Key Note",
        "Stated Goal",
        "Emotional Why",
        "Prior Solutions",
        "Routine Captured",
        "Physical/Medical Issue",
        "Plan Recommendation",
        "Current Session Activity",
        "Problem Presented",
        "Next Session Focus",
        "Homework"
    ];

    const returnVisitItems = [
        "Current Session Activity",
        "Problem Presented",
        "Next Session Focus",
        "Homework"
    ];

    const itemsToShow = isFirstTimer ? firstVisitItems : returnVisitItems;

    const isAvailable = (item: string) => {
        return opportunities.some(opp =>
            opp.toLowerCase().includes(item.toLowerCase()) ||
            item.toLowerCase().includes(opp.toLowerCase())
        );
    };

    return (
        <div className="p-1 max-w-[300px]">
            <h4 className="font-bold text-sm mb-3 border-b border-gray-700 pb-1 text-white">
                {isFirstTimer ? "First Visit Audit" : "Return Visit Audit"}
            </h4>
            <ul className="text-xs space-y-2.5">
                {itemsToShow.map((item, idx) => {
                    const available = isAvailable(item);
                    return (
                        <li key={idx} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center shrink-0 ${available ? "bg-green-500 border-green-500" : "bg-transparent"}`}>
                                {available && (
                                    <Check className="text-white" size={10} strokeWidth={4} />
                                )}
                            </div>
                            <span className={available ? "text-gray-100 font-medium" : "text-gray-500"}>
                                {item}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
