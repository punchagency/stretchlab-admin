import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SubscriptionInfoCardProps {
    unique_businesses_with_any_subscription?: number;
    number_of_subscribed_flexologists?: number;
    number_of_subscribed_locations?: number;
    average_number_of_locations_per_business?: number;
    rpa_active_count?: number;
    note_taking_active_count?: number;
}

export const SubscriptionInfoCard = ({
    unique_businesses_with_any_subscription,
    number_of_subscribed_flexologists = 0,
    number_of_subscribed_locations = 0,
    average_number_of_locations_per_business,
    rpa_active_count,
    note_taking_active_count,

}: SubscriptionInfoCardProps) => {


    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Subscription Info</h3>
            </div>

            <div className="mb-3">
                < div className="flex justify-between">
                    <div>
                        <p className="text-lg font-bold text-gray-900">
                            {number_of_subscribed_flexologists} {number_of_subscribed_flexologists <= 1 ? "Flexologist" : "Flexologists"}
                        </p>
                        <span className="text-xs text-gray-500"> {note_taking_active_count || 0} Active Note Taking</span>
                    </div>

                    <Tooltip>
                    <TooltipTrigger>

                        <div>
                            <p className="text-lg font-bold text-gray-900">
                                {number_of_subscribed_locations} {number_of_subscribed_locations <= 1 ? "Location" : "Locations"}
                            </p>
                            <span className="text-xs text-gray-500"> {rpa_active_count || 0} Active RPA</span>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                {unique_businesses_with_any_subscription || 0} subscribed businesses.
                            </p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{Math.round(Number(average_number_of_locations_per_business)) || 0} Average number of locations per business.</p>
                    </TooltipContent>
                </Tooltip>
                </div>


               



            </div>


        </div>
    );
}; 