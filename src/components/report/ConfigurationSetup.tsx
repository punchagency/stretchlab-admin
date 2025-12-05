import { useState } from "react";
import { Button } from "../shared";
import { ContainLoader } from "@/components/shared/FullLoader";
import { Plus, Trash2, Building2, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { StudioManagerConfig } from "@/service/report";

interface Manager {
    email: string;
    full_name: string;
}

interface ConfigurationSetupProps {
    managers: Manager[];
    locations: string[];
    onSubmit: (configs: StudioManagerConfig[]) => void;
    isLoading: boolean;
    isFetchingData: boolean;
}

interface ConfigItem {
    id: string;
    managers: string[];
    locations: string[];
}

export const ConfigurationSetup = ({
    managers,
    locations,
    onSubmit,
    isLoading,
    isFetchingData,
}: ConfigurationSetupProps) => {
    const [configs, setConfigs] = useState<ConfigItem[]>([
        { id: crypto.randomUUID(), managers: [], locations: [] },
    ]);

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
            configs.map((config) =>
                config.id === configId
                    ? {
                        ...config,
                        locations: config.locations.includes(location)
                            ? config.locations.filter((l) => l !== location)
                            : [...config.locations, location],
                    }
                    : config
            )
        );
    };

    const handleSubmit = () => {
        const formattedConfigs: StudioManagerConfig[] = configs.map((config) => ({
            managers: config.managers,
            location: config.locations.map((loc) => loc.toLowerCase()),
        }));
        onSubmit(formattedConfigs);
    };

    const isValid = configs.every((config) => config.managers.length > 0 && config.locations.length > 0);

    if (isFetchingData) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <ContainLoader text="Loading configuration options..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-white p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-base to-primary-tertiary rounded-xl flex items-center justify-center shadow-md">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-dark-1">
                                Report Configuration Setup
                            </h1>
                            <p className="text-grey-5 mt-1">
                                Configure studio managers and their assigned locations to access reports
                            </p>
                        </div>
                    </div>
                </div>

                {/* Configuration Cards */}
                <AnimatePresence mode="popLayout">
                    {configs.map((config, index) => (
                        <motion.div
                            key={config.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-grey-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                        <UserCog className="w-5 h-5 text-primary-base" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-dark-1">
                                        Configuration {index + 1}
                                    </h2>
                                </div>
                                {configs.length > 1 && (
                                    <Button
                                        onClick={() => removeConfig(config.id)}
                                        className="text-red-500 hover:bg-red-50 hover:border-red-300 flex items-center gap-2 py-3 justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <p className="text-sm">Remove</p>

                                    </Button>
                                )}
                            </div>

                            {/* Managers Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-dark-1 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-base rounded-full"></div>
                                    Select Managers
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {managers.map((manager) => {
                                        const isSelected = config.managers.includes(manager.email);
                                        return (
                                            <motion.div
                                                key={manager.email}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleManager(config.id, manager.email)}
                                                className={`
                          relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200
                          ${isSelected
                                                        ? "border-primary-base bg-primary-light shadow-md"
                                                        : "border-grey-3 hover:border-primary-tertiary hover:bg-primary-light/30"
                                                    }
                        `}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium truncate ${isSelected ? "text-primary-base" : "text-dark-1"}`}>
                                                            {manager.full_name}
                                                        </p>
                                                        <p className="text-xs text-grey-5 truncate mt-1">{manager.email}</p>
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

                            {/* Locations Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-dark-1 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-base rounded-full"></div>
                                    Select Locations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {locations.map((location) => {
                                        const isSelected = config.locations.includes(location);
                                        return (
                                            <motion.div
                                                key={location}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleLocation(config.id, location)}
                                                className={`
                          relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200
                          ${isSelected
                                                        ? "border-primary-base bg-primary-light shadow-md"
                                                        : "border-grey-3 hover:border-primary-tertiary hover:bg-primary-light/30"
                                                    }
                        `}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`font-medium flex-1 ${isSelected ? "text-primary-base" : "text-dark-1"}`}>
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl shadow-lg p-6">
                    <Button
                        onClick={addNewConfig}

                        className="flex-1 border-2 border-primary-base text-primary-base hover:bg-primary-light flex items-center gap-2 py-3 justify-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Another Configuration
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isLoading}
                        className="flex-1 flex items-center gap-2 py-3 justify-center bg-primary-base hover:bg-primary-base/90 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Saving Configuration...
                            </>
                        ) : (
                            <>Save Configuration</>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
