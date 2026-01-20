import { BookingBridgeConfigForm } from "@/components/forms";
import { ContainLoader } from "@/components/shared";
import { getBookingBridgeConfig } from "@/service/bookingBridge";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

export const BookingBridge = () => {
    const { data, isFetching, isPending, refetch } = useQuery({
        queryKey: ["booking-bridge"],
        queryFn: getBookingBridgeConfig,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    if (isPending) {
        return (
            <div className="w-full h-[90%]">
                <ContainLoader text="Checking for booking bridge config..." />
            </div>
        );
    }

    return (
        <div className="px-7">
            {isFetching && !isPending && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 font-semibold"
                    >
                        Refreshing...
                    </motion.div>
                </AnimatePresence>
            )}

            <BookingBridgeConfigForm
                data={data?.data.data}
                returnedWebhookUrl={data?.data.webhook_url}
                refetch={refetch}
            />
        </div>
    );
};
