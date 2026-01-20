import { Input, Button, Spinner } from "@/components/shared";
import { Switch } from "@/components/ui/switch";
import {
    verifyCredentials,
    getRobotConfig
} from "@/service/robot";
import {
    createBookingBridgeConfig,
    updateBookingBridgeConfig
} from "@/service/bookingBridge";
import { useState, useEffect } from "react";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiError } from "@/types/response";

interface BookingBridgeConfig {
    id: number;
    clubready_username: string;
    clubready_password?: string;
    locations: string;
    selected_locations: string;
    active: boolean;
    webhook_url?: string;
}

export const BookingBridgeConfigForm = ({
    data,
    refetch,
    returnedWebhookUrl,
}: {
    data?: BookingBridgeConfig | null;
    refetch: () => void;
    returnedWebhookUrl?: string;
}) => {
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const isEditing = !!data;
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

    const parseLocations = (locationData: any): string[] => {
        if (Array.isArray(locationData)) return locationData;
        if (typeof locationData === 'string') {
            try {
                const parsed = JSON.parse(locationData);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Error parsing locations:', e);
                return [];
            }
        }
        return [];
    };

    const [locations, setLocations] = useState<string[]>(parseLocations(data?.locations));
    const [selectedLocations, setSelectedLocations] = useState<string[]>(parseLocations(data?.selected_locations));
    console.log("data", data);
    useEffect(() => {
        if (data) {
            const locs = parseLocations(data.locations);
            const selectedLocs = parseLocations(data.selected_locations);

            if (locs.length > 0) setLocations(locs);
            if (selectedLocs.length > 0) setSelectedLocations(selectedLocs);

            setFormData(prev => ({
                ...prev,
                clubReadyUsername: data.clubready_username,
                clubReadyPassword: data.clubready_password || "",
                active: data.active
            }));
            setVerified(true);
            if (returnedWebhookUrl) {
                setWebhookUrl(returnedWebhookUrl);
            }
        }
    }, [data]);

    const [formData, setFormData] = useState({
        clubReadyUsername: data?.clubready_username || "",
        clubReadyPassword: data?.clubready_password || "",
        active: data?.active ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const handleLocationSelect = (location: string) => {
        setSelectedLocations(prev => {
            if (prev.includes(location) && prev.length === 1) {
                return prev;
            }
            const newSelected = prev.includes(location)
                ? prev.filter(loc => loc !== location)
                : [...prev, location];

            return newSelected;
        });
    };

    const handleVerifyCredentials = async () => {
        setError("");
        if (!formData.clubReadyUsername || !formData.clubReadyPassword) {
            setError("Please enter your ClubReady username and password");
            return;
        }
        try {
            setVerifying(true);
            const response = await verifyCredentials({
                username: formData.clubReadyUsername,
                password: formData.clubReadyPassword,
            });
            if (response.status === 200) {
                if (response.data.status) {
                    setVerified(true);
                    setLocations(response.data.locations);
                    if (selectedLocations.length === 0) {
                        setSelectedLocations(response.data.locations);
                    }
                } else {
                    renderErrorToast(response.data.message);
                }
            } else {
                renderErrorToast(response.data.message);
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(apiError.response.data.message || "Something went wrong, please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const handleUseRPAConfig = async () => {
        try {
            setVerifying(true);
            const response = await getRobotConfig();
            if (response.data && response.data.robot_config) {
                const robotConfig = response.data.robot_config;
                const configSelected = parseLocations(robotConfig.selected_locations);
                const configLocations = parseLocations(robotConfig.locations);

                setFormData(prev => ({
                    ...prev,
                    clubReadyUsername: robotConfig.users?.clubready_username || "",
                    clubReadyPassword: robotConfig.users?.clubready_password || ""
                }));
                setLocations(configLocations);
                setSelectedLocations(configSelected);
                setVerified(true);

                renderSuccessToast("Populated from RPA Config");
            } else {
                renderErrorToast("No RPA config found");
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(apiError.response.data.message || "Failed to fetch RPA config");
        } finally {
            setVerifying(false);
        }
    }

    const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");
        setWebhookUrl(null);

        if (selectedLocations.length === 0) {
            setFormError("Please select at least one location");
            return;
        }

        try {
            setSaving(true);
            let response;
            if (isEditing && data) {
                response = await updateBookingBridgeConfig({
                    id: data.id,
                    clubready_username: formData.clubReadyUsername,
                    clubready_password: formData.clubReadyPassword,
                    locations: locations,
                    selected_locations: selectedLocations,
                    active: formData.active,
                });
            } else {
                response = await createBookingBridgeConfig({
                    clubready_username: formData.clubReadyUsername,
                    clubready_password: formData.clubReadyPassword,
                    locations: locations,
                    selected_locations: selectedLocations,
                    active: formData.active,
                });
            }

            if (response.status === 200 || response.status === 201) {
                renderSuccessToast(response.data.message);
                if (response.data.webhook_url) {
                    setWebhookUrl(response.data.webhook_url);
                }
                refetch();
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(apiError.response.data.message || "Something went wrong, please try again.");
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        renderSuccessToast("Copied to clipboard!");
    }

    return (
        <div className="block md:flex gap-5 mx-auto w-full max-w-[1550px] flex-col">
            {webhookUrl && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium mb-2">Webhook URL</h3>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white p-2 rounded border text-xs break-all">
                            {webhookUrl}
                        </code>
                        <Button
                            className="bg-white border text-black hover:bg-gray-100 px-3 py-1 rounded text-xs"
                            onClick={() => copyToClipboard(webhookUrl)}
                        >
                            Copy
                        </Button>
                    </div>
                    <p className="mt-3 text-xs text-gray-500 italic flex items-center gap-1">
                        <span className="text-orange-600 font-semibold italic">Note:</span>
                        Please copy this URL and paste it into SoundHound.
                    </p>
                </div>
            )}
            <div className="border border-grey-1 w-full rounded-3xl py-6 px-4 md:px-8 bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg md:text-xl font-semibold">
                        {isEditing ? "Update Booking Bridge Config" : "Setup Booking Bridge"}
                    </h2>
                    {!isEditing && (
                        <Button
                            type="button"
                            onClick={handleUseRPAConfig}
                            className="bg-white text-primary-base border border-primary-base px-4 py-2 rounded-lg text-sm"
                            disabled={verifying}
                        >
                            Use RPA Config
                        </Button>
                    )}
                </div>

                <form className="mt-8 flex flex-col gap-5" onSubmit={handleSaveSettings}>
                    <Input
                        label="ClubReady Username"
                        type="text"
                        name="clubReadyUsername"
                        disabled={verifying}
                        placeholder="Enter your ClubReady username"
                        value={formData.clubReadyUsername}
                        onChange={handleChange}
                        helperText="Enter your ClubReady username."
                    />

                    <Input
                        label="ClubReady Password"
                        type="password"
                        name="clubReadyPassword"
                        disabled={verifying}
                        placeholder="Enter your ClubReady password"
                        helperText="Enter your ClubReady password."
                        value={formData.clubReadyPassword}
                        onChange={handleChange}
                    />

                    {error && (
                        <div className="bg-red-100 rounded-lg px-2 py-3">
                            <p className="text-red-500 font-medium text-sm text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    {!verified ? (
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleVerifyCredentials}
                                className="bg-[#FFD700] text-xs md:text-sm flex items-center gap-2 text-white py-2"
                                disabled={verifying}
                            >
                                {verifying ? (
                                    <>
                                        <Spinner />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Credentials"
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-end items-center gap-2">
                            <Button
                                className="bg-orange-500 py-2 text-white text-xs md:text-sm"
                                type="button"
                                onClick={() => {
                                    setVerified(false);
                                }}
                            >
                                Re-Verify Credentials
                            </Button>
                        </div>
                    )}

                    <AnimatePresence>
                        {verified && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >

                                {/* Location Selection */}
                                {locations.length > 0 && (
                                    <div className="space-y-3 mt-4">
                                        <p className="text-xs font-medium text-gray-600">
                                            {selectedLocations.length} of {locations.length} Select Studio Locations
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2  border rounded-lg p-2">
                                            {locations.map((location, _) => (
                                                <div
                                                    key={location}
                                                    onClick={() => handleLocationSelect(location)}
                                                    className={`p-2 rounded-md border cursor-pointer transition-all duration-200 text-xs ${selectedLocations.includes(location)
                                                        ? "border-green-500 bg-green-50 text-green-700"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h5 className="font-medium text-xs">{location}</h5>
                                                        </div>
                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedLocations.includes(location)
                                                            ? "border-green-500 bg-green-500"
                                                            : "border-gray-300"
                                                            }`}>
                                                            {selectedLocations.includes(location) && (
                                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}

                                {isEditing && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <label className="text-sm font-medium">Activate</label>
                                        <Switch
                                            checked={formData.active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                            className="data-[state=checked]:bg-primary-base"
                                        />
                                    </div>
                                )}

                                {formError && (
                                    <div className="bg-red-100 rounded-lg px-2 py-3 mt-4">
                                        <p className="text-red-500 font-medium text-sm text-center">
                                            {formError}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-6 items-center">
                                    <Button
                                        type="submit"
                                        disabled={!verified || saving || selectedLocations.length === 0}
                                        className="mt-5 bg-primary-base flex items-center justify-center gap-2 w-full text-white py-3 md:py-4 text-xs md:text-base"
                                    >
                                        {saving ? (
                                            <>
                                                <Spinner />
                                                {isEditing ? "Updating..." : "Saving..."}
                                            </>
                                        ) : isEditing ? (
                                            "Update Booking Bridge"
                                        ) : (
                                            "Create Booking Bridge"
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>



            </div>
        </div>
    );
};
