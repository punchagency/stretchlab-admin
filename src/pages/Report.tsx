import { DataTable } from "@/components/datatable";
import { FilterDropdown } from "@/components/shared";
import { ContainLoader } from "@/components/shared/FullLoader";
import { ErrorHandle } from "@/components/app/ErrorHandle";
import { useReportData } from "@/components/report/useReportData";
import { getReportColumns } from "@/components/report/columns";
import { ConfigurationSetup } from "@/components/report/ConfigurationSetup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRobotConfig, addStudioManagers } from "@/service/report";
import { fetchManagers, fetchLocations } from "@/service/user";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { useState, useEffect } from "react";

export const Report = () => {
  const [hasConfiguration, setHasConfiguration] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const {
    data: configData,
    isLoading: isCheckingConfig,
    error: configError,
    refetch: refetchConfig
  } = useQuery({
    queryKey: ["robotConfig"],
    queryFn: getRobotConfig,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: managersData, isLoading: isLoadingManagers } = useQuery({
    queryKey: ["managers"],
    queryFn: fetchManagers,
    enabled: hasConfiguration === false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    enabled: hasConfiguration === false,
    staleTime: 5 * 60 * 1000,
  });

  const addConfigMutation = useMutation({
    mutationFn: addStudioManagers,
    onSuccess: () => {
      renderSuccessToast("Configuration saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["robotConfig"] });
      setHasConfiguration(true);
    },
    onError: (error: any) => {
      renderErrorToast(error?.response?.data?.message || "Failed to save configuration");
    },
  });

  useEffect(() => {
    if (configData) {
      const hasStudioManagers = !!(configData.robot_config.studio_managers);
      setHasConfiguration(hasStudioManagers);
    }
  }, [configData]);

  const {
    type,
    setType,
    data,
    isLoading,
    error,
    refetch,
    handleStatusChange,
    isUpdating,
    handleContact,
    isContacting,
  } = useReportData();

  const columns = getReportColumns({
    type,
    handleStatusChange,
    isUpdating,
    handleContact,
    isContacting,
  });

  // Loading state for checking configuration
  if (isCheckingConfig || hasConfiguration === null) {
    return (
      <div className="w-full h-[90vh]">
        <ContainLoader text="Loading ..." />
      </div>
    );
  }

  // Error state for configuration check
  if (configError) {
    return (
      <div className="w-full h-[90vh]">
        <ErrorHandle retry={refetchConfig} />
      </div>
    );
  }

  if (!hasConfiguration) {
    const managers = managersData?.data?.data?.managers || [];
    const locations = locationsData?.data?.locations || [];

    return (
      <ConfigurationSetup
        managers={managers}
        locations={locations}
        onSubmit={(configs) => addConfigMutation.mutate(configs)}
        isLoading={addConfigMutation.isPending}
        isFetchingData={isLoadingManagers || isLoadingLocations}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Fetching report..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%]">
        <ErrorHandle retry={refetch} />
      </div>
    );
  }

  const tableData = data?.data || [];

  return (
    <div className="p-4 sm:p-6 sm:pt-0 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
        <h3 className="md:text-2xl text-lg font-semibold capitalize">
          {type === "health"
            ? "Healthcare setup error report"
            : type === "resign_soon"
              ? "Resign Soon Report"
              : type === "welld"
                ? "Welld Report"
                : "Unused credit report"}
        </h3>
        <FilterDropdown
          value={type}
          options={[
            { value: "increase", label: "Unused credit report" },
            { value: "health", label: "Healthcare setup error report" },
            { value: "resign_soon", label: "Resign Soon Report" },
            { value: "welld", label: "Welld Report" },
          ]}
          onChange={(value) => setType(value)}
          className="w-full md:w-70"
        />
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        emptyText="No data found"
        tableContainerClassName="bg-white"
        enableSorting
        enableSearch
        searchFields={
          type === "health"
            ? ["first_name", "last_name", "details", "user_id", "cell_phone"]
            : type === "resign_soon"
              ? ["full_name", "location", "package", "sessions_left"]
              : type === "welld"
                ? ["full_name", "location", "email", "pass_id", "program", "remarks"]
                : ["first_name", "last_name", "email", "user_id", "location", "package_name"]
        }
        searchPlaceholder="Search by name, email, user ID"
      />
    </div>
  );
};