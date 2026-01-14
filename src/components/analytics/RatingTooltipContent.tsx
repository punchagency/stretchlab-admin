export const RatingTooltipContent = () => {
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
        "Physical/Medical",
        "Issue",
        "Plan",
        "Recommendation",
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

    return (
        <div className="p-2 min-w-[300px]">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-bold text-sm mb-2 border-b pb-1">First Visit</h4>
                    <ul className="text-xs space-y-1 text-gray-200">
                        {firstVisitItems.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-2 border-b pb-1">Return Visit</h4>
                    <ul className="text-xs space-y-1 text-gray-200">
                        {returnVisitItems.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-xs text-gray-200 mt-3 font-semibold">
                <p>NOTE : The rating system is subject change as StretchNote is refined.</p>
            </div>
        </div>
    );
};
