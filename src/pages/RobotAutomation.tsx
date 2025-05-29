import { RobotConfigForm } from "@/components/forms";
import { ContainLoader } from "@/components/shared";
import { getRobotConfig } from "@/service/robot";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

export const RobotAutomation = () => {
  const { data, isFetching, isPending, refetch } = useQuery({
    queryKey: ["robot-config"],
    queryFn: getRobotConfig,
  });

  if (isPending) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Checking for robot config..." />
      </div>
    );
  }

  return (
    <div>
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
      <RobotConfigForm
        refetch={refetch}
        data={data?.data.config ? data.data.robot_config : undefined}
      />
    </div>
  );
};
