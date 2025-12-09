import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRobotConfig, addStudioManagers, type StudioManagerConfig } from "@/service/report";
import { fetchManagers, fetchLocations } from "@/service/user";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { ContainLoader } from "@/components/shared/FullLoader";
import { Plus, Trash2, Building2, UserCog, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../shared";

interface Manager {
    email: string;
    full_name: string;
}

interface ConfigItem {
    id: string;
    managers: string[];
    locations: string[];
}

export const ReportConfigSection = () => {
    const [configs, setConfigs] = useState<ConfigItem[]>([
        { id: crypto.randomUUID(), managers: [], locations: [] },
    ]);
    const queryClient = useQueryClient();
    const { data: configData, isLoading: isLoadingConfig } = useQuery({
        queryKey: ["robotConfig"],
        queryFn: getRobotConfig,
        staleTime: 5 * 60 * 1000,
    });
    const { data: managersData, isLoading: isLoadingManagers } = useQuery({
        queryKey: ["managers"],
        queryFn: fetchManagers,
        staleTime: 5 * 60 * 1000,
    });
    const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
        queryKey: ["locations"],
        queryFn: fetchLocations,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (configData?.robot_config?.studio_managers) {
            try {
                const parsedManagers: StudioManagerConfig[] = JSON.parse(
                    configData.robot_config.studio_managers
                );

                if (Array.isArray(parsedManagers) && parsedManagers.length > 0) {
                    const existingConfigs: ConfigItem[] = parsedManagers.map((config) => ({
                        id: crypto.randomUUID(),
                        managers: config.managers || [],
                        locations: config.location || [],
                    }));
                    setConfigs(existingConfigs);
                }
            } catch (error) {
                console.error("Error parsing studio_managers:", error);
            }
        }
    }, [configData]);

    const updateConfigMutation = useMutation({
        mutationFn: addStudioManagers,
        onSuccess: () => {
            renderSuccessToast("Configuration updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["robotConfig"] });
        },
        onError: (error: any) => {
            renderErrorToast(error?.response?.data?.message || "Failed to update configuration");
        },
    });

    const addNewConfig = () => {
        setConfigs([...configs, { id: crypto.randomUUID(), managers: [], locations: [] }]);
    };

    const removeConfig = (id: string) => {
        if (configs.length > 1) {
            setConfigs(configs.filter((config) => config.id !== id));
        }
    };

    const toggleManager = (configId: string, managerEmail: string) => {
        setConfigs(
            configs.map((config) =>
                config.id === configId
                    ? {
                        ...config,
                        managers: config.managers.includes(managerEmail)
                            ? config.managers.filter((m) => m !== managerEmail)
                            : [...config.managers, managerEmail],
                    }
                    : config
            )
        );
    };

    const toggleLocation = (configId: string, location: string) => {
        setConfigs(
            configs.map((config) => {
                if (config.id === configId) {
                    const existingIndex = config.locations.findIndex(
                        (l) => l.toLowerCase() === location.toLowerCase()
                    );
                    if (existingIndex !== -1) {
                        return {  
                            ...config,
                            locations: config.locations.filter((_, idx) => idx !== existingIndex),
                        };
                    } else {
                        return {
                            ...config,
                            locations: [...config.locations, location],
                        };
                    }
                }
                return config;
            })
        );
    };

    const handleSubmit = () => {
        const formattedConfigs: StudioManagerConfig[] = configs.map((config) => ({
            managers: config.managers,
            location: config.locations.map((loc) => loc.toLowerCase()),
        }));
        updateConfigMutation.mutate(formattedConfigs);
    };

    const isValid = configs.every((config) => config.managers.length > 0 && config.locations.length > 0);
    const managers = managersData?.data?.data?.managers || [];
    const locations = locationsData?.data?.locations || [];
    const isLoadingData = isLoadingConfig || isLoadingManagers || isLoadingLocations;

    if (isLoadingData) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <ContainLoader text="Loading configuration..." />
            </div>
        );
    }

    return (
        <div className="px-2 lg:px-6 py-2">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="hidden md:flex w-10 h-10 bg-gradient-to-br from-primary-base to-primary-tertiary rounded-lg  items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base md:text-xl font-semibold text-dark-1">Report Configuration</h2>
                        <p className="text-xs md:text-sm text-grey-5">
                            Manage studio managers and their assigned locations for reports
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mb-6">
                <AnimatePresence mode="popLayout">
                    {configs.map((config, index) => (
                        <motion.div
                            key={config.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 rounded-xl p-4 md:p-6 border border-grey-3"
                        >

                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-grey-3">
                                <div className="flex items-center gap-2">
                                    <div className="hidden md:flex w-8 h-8 bg-primary-light rounded-lg  items-center justify-center">
                                        <UserCog className="  w-4 h-4 text-primary-base" />
                                    </div>
                                    <h3 className="text-sm md:text-lg font-semibold text-dark-1">
                                        Configuration {index + 1}
                                    </h3>
                                </div>
                                {configs.length > 1 && (
                                    <Button
                                        onClick={() => removeConfig(config.id)}
                                        className="text-red-500 hover:bg-red-50 hover:border-red-300 flex items-center gap-2 py-2 px-3 text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden md:inline">Remove</span>
                                    </Button>
                                )}
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-dark-1 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-base rounded-full"></div>
                                    Select Managers 
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {managers.map((manager: Manager) => {
                                        const isSelected = config.managers.includes(manager.email);
                                        return (
                                            <motion.div
                                                key={manager.email}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => toggleManager(config.id, manager.email)}
                                                className={`
                          cursor-pointer rounded-lg p-3 border-2 transition-all duration-200
                          ${isSelected
                                                        ? "border-primary-base bg-primary-light"
                                                        : "border-grey-3 hover:border-primary-base/50 hover:bg-primary-light/30"
                                                    }
                        `}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium text-sm truncate ${isSelected ? "text-primary-base" : "text-dark-1"}`}>
                                                            {manager.full_name}
                                                        </p>
                                                        <p className="text-xs text-grey-5 truncate">{manager.email}</p>
                                                    </div>
                                                    <div
                                                        className={`
                              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                              ${isSelected
                                                                ? "border-primary-base bg-primary-base"
                                                                : "border-grey-3"
                                                            }
                            `}
                                                    >
                                                        {isSelected && (
                                                            <motion.div 
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-white rounded-sm"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                {config.managers.length === 0 && (
                                    <p className="text-sm text-red-500 mt-2">Please select at least one manager</p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-dark-1 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-base rounded-full"></div>
                                    Select Locations
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {locations.map((location: string) => {
                                        const isSelected = config.locations.some(
                                            (l) => l.toLowerCase() === location.toLowerCase()
                                        );
                                        return (
                                            <motion.div
                                                key={location}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => toggleLocation(config.id, location)}
                                                className={`
                          cursor-pointer rounded-lg p-3 border-2 transition-all duration-200
                          ${isSelected
                                                        ? "border-primary-base bg-primary-light"
                                                        : "border-grey-3 hover:border-primary-base/50 hover:bg-primary-light/30"
                                                    }
                        `}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`font-medium text-sm flex-1 ${isSelected ? "text-primary-base" : "text-dark-1"}`}>
                                                        {location}
                                                    </p>
                                                    <div
                                                        className={`
                              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                              ${isSelected
                                                                ? "border-primary-base bg-primary-base"
                                                                : "border-grey-3"
                                                            }
                            `}
                                                    >
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-white rounded-sm"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                {config.locations.length === 0 && (
                                    <p className="text-sm text-red-500 mt-2">Please select at least one location</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white py-4 border-t border-grey-3">
                <Button
                    onClick={addNewConfig}
                    className="flex-1 border-2 border-primary-base text-primary-base hover:bg-primary-light flex items-center gap-2 py-3 justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Add Configuration
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || updateConfigMutation.isPending}
                    className="flex-1 flex items-center gap-2 py-3 justify-center bg-primary-base hover:bg-primary-base/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updateConfigMutation.isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
