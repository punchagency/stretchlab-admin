import type { RobotConfig, ApiError } from "@/types/response";
import { Button } from "../shared";
import { updateRobotStatus } from "@/service/robot";
import { useState } from "react";
import { renderSuccessToast, renderErrorToast } from "../utils";
import { Spinner } from "../shared";
export const Config = ({
  data,
  setIsConfig,
  refetch,
}: {
  data: RobotConfig;
  setIsConfig: (isConfig: boolean) => void;
  refetch: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async () => {
    try {
      setIsLoading(true);
      const response = await updateRobotStatus({
        status: data.active ? "DISABLED" : "ENABLED",
      });
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch();
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 flex items-center justify-between w-1/2 bg-primary-secondary px-3 py-3 rounded-xl shadow-md">
      <div>
        <h4 className="text-lg font-semibold capitalize">{data.name}</h4>
        <p className="text-sm font-semibold text-gray-500">
          <span>Number of Studio Locations:</span> {data.number_of_locations}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          <span>Run Time:</span> {data.run_time}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-grey-5 text-sm font-semibold py-2 text-white"
          onClick={() => setIsConfig(false)}
        >
          Edit
        </Button>
        {data?.active ? (
          <Button
            className="bg-red-500 flex items-center gap-2 text-sm font-semibold py-2 text-white"
            onClick={handleChangeStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Disabling...
              </>
            ) : (
              "Disable"
            )}
          </Button>
        ) : (
          <Button
            className="bg-green-500 flex items-center gap-2 text-sm font-semibold py-2 text-white"
            onClick={handleChangeStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Enabling...
              </>
            ) : (
              "Enable"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
