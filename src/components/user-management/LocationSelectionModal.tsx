import { useState, useEffect } from "react";
import { Modal, ContainLoader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { MapPin, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLocations as fetchLocationsService } from "@/service/user";
import type { ApiError } from "@/types";

interface LocationSelectionModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: (selectedLocations: string[]) => void;
    isLoading?: boolean;
    initialSelectedLocations?: string[]; 
}

export const LocationSelectionModal = ({
    show,
    onClose,
    onConfirm,
    isLoading = false,
    initialSelectedLocations = [],
}: LocationSelectionModalProps) => {
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (show) {
            fetchLocations();
        }
    }, [show]);

    useEffect(() => {
        if (show && locations.length > 0 && initialSelectedLocations.length > 0) {
            const normalizedInitialSelections = initialSelectedLocations.map(loc => loc.toLowerCase());

            const matchedLocations = locations.filter(location =>
                normalizedInitialSelections.includes(location.toLowerCase())      
            );

            setSelectedLocations(matchedLocations);
        }
    }, [show, locations, initialSelectedLocations]);

    const fetchLocations = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const response = await fetchLocationsService();

            if (response.data?.status === "success") {
                setLocations(response.data.locations || []);
            } else {
                setError("Failed to fetch locations");
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Error loading locations");
            console.error("Error fetching locations:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const toggleLocation = (location: string) => {
        setSelectedLocations((prev) =>
            prev.includes(location)
                ? prev.filter((l) => l !== location)
                : [...prev, location]
        );
    };

    const handleConfirm = () => {
        const lowercaseLocations = selectedLocations.map((loc) => loc.toLowerCase());
        onConfirm(lowercaseLocations);
    };

    const handleClose = () => {
        setSelectedLocations([]);
        setError(null);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <div className="flex flex-col gap-6 py-6 px-4 md:px-4 max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-grey-3 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary-base" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-dark-1">
                                {initialSelectedLocations.length > 0 ? 'Edit' : 'Select'} Excluded Locations
                            </h2>
                            <p className="text-sm text-grey-5 mt-1">
                                Choose locations to exclude this user from accessing
                            </p>
                        </div>
                    </div>
                    {/* <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full hover:bg-neutral-base transition-colors flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-grey-5" />
                    </button> */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {isFetching ? (
                        <div className="h-64 flex items-center justify-center">
                            <ContainLoader text="Loading locations..." />
                        </div>
                    ) : error ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-500 font-medium">{error}</p>
                            <Button
                                onClick={fetchLocations}
                                variant="outline"
                                className="mt-2"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto max-h-96 pr-6">
                            {locations.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-grey-5 font-medium">No locations available</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {locations.map((location, index) => {
                                        const isSelected = selectedLocations.includes(location);
                                        return (
                                            <motion.div
                                                key={location}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                onClick={() => toggleLocation(location)}
                                                className={`
                          relative group cursor-pointer rounded-lg border-2 transition-all duration-200
                          ${isSelected
                                                        ? "border-primary-base bg-primary-light shadow-md"
                                                        : "border-grey-3 hover:border-primary-tertiary hover:bg-primary-light/30"
                                                    }
                        `}
                                            >
                                                <div className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`
                                w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
                                ${isSelected
                                                                    ? "border-primary-base bg-primary-base"
                                                                    : "border-grey-3 group-hover:border-primary-tertiary"
                                                                }
                              `}
                                                        >
                                                            <AnimatePresence>
                                                                {isSelected && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        exit={{ scale: 0 }}
                                                                    >
                                                                        <Check className="w-4 h-4 text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-primary-base' : 'text-grey-5'}`} />
                                                            <span
                                                                className={`
                                  font-medium transition-colors
                                  ${isSelected ? "text-primary-base" : "text-dark-1 group-hover:text-primary-base"}
                                `}
                                                            >
                                                                {location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-grey-3 pt-4 flex items-center justify-between">
                    <div className="text-sm">
                        <span className="text-grey-5">Selected: </span>
                        <span className="font-semibold text-primary-base">
                            {selectedLocations.length} location{selectedLocations.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            disabled={isLoading}
                            className="min-w-24"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={selectedLocations.length === 0 || isLoading}
                            className="bg-primary-base hover:bg-primary-base/90 text-white min-w-24"
                        >
                            {isLoading ? "Granting..." : "Confirm"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
