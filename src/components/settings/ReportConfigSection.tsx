import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRobotConfig, addStudioManagers, type StudioManagerConfig } from "@/service/report";
import { fetchManagers, fetchLocations } from "@/service/user";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { ContainLoader } from "@/components/shared/FullLoader";
import { MultiSelectDropdown } from "../shared/MultiDropdown";
import { Plus, Trash2, Building2, UserCog, Save, Edit2, X, MapPin, Users } from "lucide-react";
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
    isEditing?: boolean;
}

export const ReportConfigSection = () => {
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [tempManagers, setTempManagers] = useState<string[]>([]);
    const [tempLocations, setTempLocations] = useState<string[]>([]);

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
                        isEditing: false,
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
        setIsAddingNew(true);
        setTempManagers([]);
        setTempLocations([]);
    };

    const cancelAddConfig = () => {
        setIsAddingNew(false);
        setTempManagers([]);
        setTempLocations([]);
    };

    const saveNewConfig = () => {
        if (tempManagers.length > 0 && tempLocations.length > 0) {
            setConfigs([
                ...configs,
                {
                    id: crypto.randomUUID(),
                    managers: tempManagers,
                    locations: tempLocations,
                    isEditing: false,  
                },
            ]);
            setIsAddingNew(false);
            setTempManagers([]);
            setTempLocations([]);
        }
    };

    const removeConfig = (id: string) => {
        setConfigs(configs.filter((config) => config.id !== id));
    };

    const toggleEditConfig = (id: string) => {
        setConfigs(
            configs.map((config) =>
                config.id === id
                    ? { ...config, isEditing: !config.isEditing }
                    : config
            )
        );
    };

    const updateConfigManagers = (id: string, managers: string[]) => {
        setConfigs(
            configs.map((config) =>
                config.id === id ? { ...config, managers } : config
            )
        );
    };

    const updateConfigLocations = (id: string, locations: string[]) => {
        setConfigs(
            configs.map((config) =>
                config.id === id ? { ...config, locations } : config
            )
        );
    };

    const handleSubmit = () => {
        const formattedConfigs: StudioManagerConfig[] = configs.map((config) => ({
            managers: config.managers,
            location: config.locations.map((loc) => loc.toLowerCase()),
        }));
        updateConfigMutation.mutate(formattedConfigs);
    };

    const isValid = configs.length > 0;
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

    // Get manager names for display
    const getManagerNames = (managerEmails: string[]) => {
        return managerEmails
            .map((email) => managers.find((m: Manager) => m.email === email)?.email || email)
            .filter(Boolean);
    };

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
                                <div className="flex items-center gap-1">
                                    <div className="hidden md:flex w-8 h-8 bg-primary-light rounded-lg  items-center justify-center">
                                        <UserCog className="  w-4 h-4 text-primary-base" />
                                    </div>
                                    <p className="text-sm md:text-base font-semibold text-dark-1">
                                        Configuration {index + 1}
                                    </p>
                                </div>
                                <div className="flex">
                                    <Button
                                        onClick={() => toggleEditConfig(config.id)}
                                        className="text-primary-base hover:bg-primary-light hover:border-primary-base flex items-center gap-1 py-1 px-2x text-sm"
                                    >
                                        {config.isEditing ? (
                                            <>
                                                <X className="w-3 h-3" />
                                                <span className="hidden md:inline text-xs">Cancel</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 className="w-3 h-3" />
                                                <span className="hidden md:inline text-xs">Edit</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => removeConfig(config.id)}
                                        className="text-red-500 hover:bg-red-50 hover:border-red-300 flex items-center gap-2 py-2 px-3 text-sm"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span className="hidden md:inline text-xs">Remove</span>
                                    </Button>
                                </div>
                            </div>

                            {config.isEditing ? (
                                <>
                                    {/* Edit Mode with Dropdowns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <MultiSelectDropdown
                                            label="Select  Managers"
                                            options={managers.map((m: Manager) => ({
                                                value: m.email,
                                                label: m.email,
                                            }))}
                                            selectedValues={config.managers}
                                            onMultiChange={(values) => updateConfigManagers(config.id, values)}
                                            multiSelect={true}
                                            showSearch={true}
                                            showLabel={true}
                                        />
                                        <MultiSelectDropdown
                                            label="Select Locations"
                                            options={locations}
                                            selectedValues={config.locations.map(loc =>
                                                locations.find((l: string) => l.toLowerCase() === loc.toLowerCase()) || loc
                                            )}
                                            onMultiChange={(values) => updateConfigLocations(config.id, values)}
                                            multiSelect={true}
                                            showSearch={true}
                                            showLabel={true}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Display Mode */}
                                    <div className="mb-4">
                                        <h4 className="text-xs font-semibold text-dark-1 mb-2 flex items-center gap-2">
                                            <Users className="w-3 h-3 text-primary-base" />
                                            Managers
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {getManagerNames(config.managers).map((name) => (
                                                <span
                                                    key={name}
                                                    className="px-2 py-1 bg-primary-light text-primary-base rounded-lg text-xs font-medium border border-primary-base/30"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-semibold text-dark-1 mb-2 flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-primary-base" />
                                            Locations
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {config.locations.map((location) => (
                                                <span
                                                    key={location}
                                                    className="capitalize px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200"
                                                >
                                                    {location}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Configuration Form */}
                {(isAddingNew || configs.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 rounded-xl p-4 md:p-6 border border-grey-3"
                    >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-grey-3">
                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex w-8 h-8 bg-primary-light rounded-lg  items-center justify-center">
                                    <UserCog className="w-4 h-4 text-primary-base" />
                                </div>
                                <h3 className="text-sm md:text-lg font-semibold text-dark-1">New Configuration</h3>
                            </div>
                            <Button
                                onClick={cancelAddConfig}
                                className={`text-grey-5 hover:bg-grey-1 hover:border-grey-3 flex items-center gap-2 py-2 px-3 text-sm ${configs.length === 0 ? 'hidden' : ''}`}
                            >
                                <X className="w-4 h-4" />
                                <span className="hidden md:inline">Cancel</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <MultiSelectDropdown
                                // label="Select Managers"
                                options={managers.map((m: Manager) => ({
                                    value: m.email,
                                    label: m.email,
                                }))}
                                selectedValues={tempManagers}
                                onMultiChange={setTempManagers}
                                multiSelect={true}
                                showSearch={true}
                                placeholder="Select Managers"
                            // showLabel={true}
                            />
                            <MultiSelectDropdown
                                // label="Select Locations"
                                options={locations}
                                selectedValues={tempLocations}
                                onMultiChange={setTempLocations}
                                multiSelect={true}
                                showSearch={true}
                                placeholder="Select Locations"
                            // showLabel={true}
                            />
                        </div>

                        {/* Preview Section */}
                        {(tempManagers.length > 0 || tempLocations.length > 0) && (
                            <div className="bg-white rounded-lg p-3 mb-4">
                                <h4 className="text-xs font-semibold text-dark-1 mb-2">Preview</h4>
                                {tempManagers.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-xs text-grey-5 mb-1">Managers ({tempManagers.length})</p>
                                        <div className="flex flex-wrap gap-1">
                                            {getManagerNames(tempManagers).map((name) => (
                                                <span
                                                    key={name}
                                                    className="px-2 py-1 bg-primary-light text-primary-base rounded text-xs font-medium"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {tempLocations.length > 0 && (
                                    <div>
                                        <p className="text-xs text-grey-5 mb-1">Locations ({tempLocations.length})</p>
                                        <div className="flex flex-wrap gap-1">
                                            {tempLocations.map((location) => (
                                                <span
                                                    key={location}
                                                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                                                >
                                                    {location}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={saveNewConfig}
                            disabled={tempManagers.length === 0 || tempLocations.length === 0}
                            className="w-full bg-primary-base hover:bg-primary-base/90 text-white py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 mr-2 inline" />
                            Add Configuration
                        </Button>
                    </motion.div>
                )}
            </div>


            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white py-4 ">
                {!isAddingNew && configs.length > 0 && (
                    <Button
                        onClick={addNewConfig}
                        className="flex-1 border-2 border-primary-base text-primary-base hover:bg-primary-light flex items-center gap-2 py-3 justify-center text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Configuration
                    </Button>
                )}
                {configs.length > 0 && (
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || updateConfigMutation.isPending}
                        className="flex-1 flex items-center gap-2 py-3 justify-center bg-primary-base hover:bg-primary-base/90 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                )}
            </div>
        </div>
    );
};
