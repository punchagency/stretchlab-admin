import { useState } from "react";
import type { Location } from "@/types/response";
import { Button } from "../shared";
import { MultiSelectDropdown } from "../shared/MultiDropdown";
import { ContainLoader } from "@/components/shared/FullLoader";
import { Plus, Trash2, Building2, UserCog, MapPin, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { StudioManagerConfig } from "@/service/report";

interface Manager {
    email: string;
    full_name: string;
}

interface ConfigurationSetupProps {
    managers: Manager[];
    locations: Location[] | string[];
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
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [tempManagers, setTempManagers] = useState<string[]>([]);
    const [tempLocations, setTempLocations] = useState<string[]>([]);

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

    const handleSubmit = () => {
        const formattedConfigs: StudioManagerConfig[] = configs.map((config) => ({
            managers: config.managers,
            location: config.locations.map((loc) => loc.toLowerCase()),
        }));
        onSubmit(formattedConfigs);
    };

    const isValid = configs.length > 0;

    if (isFetchingData) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <ContainLoader text="Loading configuration options..." />
            </div>
        );
    }

    const getManagerNames = (managerEmails: string[]) => {
        return managerEmails
            .map((email) => managers.find((m) => m.email === email)?.email)
            .filter(Boolean);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-white p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-base to-primary-tertiary rounded-xl flex items-center justify-center shadow-md">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-xl font-bold text-dark-1">
                                Report Configuration Setup
                            </h1>
                            <p className="text-grey-5 mt-1 text-sm">
                                Configure studio managers and their assigned locations to access reports
                            </p>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    {configs.map((config, index) => (
                        <motion.div
                            key={config.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6 md:p-4 mb-6"
                        >

                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-grey-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                        <UserCog className="w-5 h-5 text-primary-base" />
                                    </div>
                                    <h2 className="text-base font-semibold text-dark-1">
                                        Configuration {index + 1}
                                    </h2>
                                </div>
                                <Button
                                    onClick={() => removeConfig(config.id)}
                                    className="text-red-500 hover:bg-red-50 hover:border-red-300 flex items-center gap-2 py-3 justify-center"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <p className="text-sm">Remove</p>
                                </Button>
                            </div>


                            <div className="mb-4">
                                <p className="text-xs font-semibold text-dark-1 mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary-base" />
                                    Managers
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {getManagerNames(config.managers).map((name) => (
                                        <span
                                            key={name}
                                            className="px-3 py-2 bg-primary-light text-primary-base rounded-lg text-xs font-medium border border-primary-base/30"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>


                            <div>
                                <h3 className="text-xs font-semibold text-dark-1 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary-base text-sm" />
                                    Locations
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {config.locations.map((location) => (
                                        <span
                                            key={location}
                                            className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                                        >
                                            {location}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>


                {(isAddingNew || configs.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
                    >
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-grey-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                    <UserCog className="w-5 h-5 text-primary-base" />
                                </div>
                                <h2 className="text-base font-semibold text-dark-1">New Configuration</h2>
                            </div>
                            {configs.length > 0 && (
                                <Button
                                    onClick={cancelAddConfig}
                                    className="text-grey-5 hover:bg-grey-1 hover:border-grey-3 flex items-center gap-2 py-3 justify-center"
                                >
                                    <X className="w-4 h-4" />
                                    <p className="text-sm">Cancel</p>
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <MultiSelectDropdown
                                options={managers.map((m) => ({
                                    value: m.email,
                                    label: m.email,
                                }))}
                                selectedValues={tempManagers}
                                onMultiChange={setTempManagers}
                                multiSelect={true}
                                showSearch={true}
                                showLabel={false}
                                placeholder="Select  Managers"
                            />

                            <MultiSelectDropdown
                                options={locations.map(loc => typeof loc === 'string' ? loc : loc.location_name)}
                                selectedValues={tempLocations}
                                onMultiChange={setTempLocations}
                                multiSelect={true}
                                showSearch={true}
                                showLabel={false}
                                placeholder="Select Locations"
                            />
                        </div>

                        {(tempManagers.length > 0 || tempLocations.length > 0) && (
                            <div className="bg-grey-1 rounded-xl p-4 mb-4">
                                <h4 className="text-sm font-semibold text-dark-1 mb-3">Preview</h4>
                                {tempManagers.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs text-grey-5 mb-2">Managers ({tempManagers.length})</p>
                                        <div className="flex flex-wrap gap-2">
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
                                        <p className="text-xs text-grey-5 mb-2">Locations ({tempLocations.length})</p>
                                        <div className="flex flex-wrap gap-2">
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
                            className="w-full bg-primary-base hover:bg-primary-base/90 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5 mr-2 inline" />
                            Add Configuration
                        </Button>
                    </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 bg-white p-6">
                    {!isAddingNew && configs.length > 0 && (
                        <Button
                            onClick={addNewConfig}
                            className="flex-1 border-2 border-primary-base text-primary-base hover:bg-primary-light flex items-center gap-2 py-3 justify-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Configuration
                        </Button>
                    )}
                    {configs.length > 0 && (
                        <Button
                            onClick={handleSubmit}
                            disabled={!isValid || isLoading}
                            className="flex-1 flex items-center gap-2 py-3 justify-center bg-primary-base hover:bg-primary-base/90 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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
                    )}
                </div>
            </motion.div>
        </div>
    );
};
