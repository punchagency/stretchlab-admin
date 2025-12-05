import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import type { BusinessInfo } from "@/types";
import { BusinessDetailSkeleton } from "./BusinessDetailSkeleton";
import { RefreshCcw } from "lucide-react";

interface BusinessDetailModalProps {
    businessInfo: BusinessInfo | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    onRetry?: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
    businessInfo,
    isOpen,
    onClose,
    isLoading,
    onRetry,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string | null) => {
        if (!status) return { label: "None", color: "bg-gray-100 text-gray-600" };

        const statusConfig = {
            "trialing": { label: "Trialing", color: "bg-blue-100 text-blue-800" },
            "active": { label: "Active", color: "bg-green-100 text-green-800" },
            "inactive": { label: "Inactive", color: "bg-red-100 text-red-800" },
        };

        return statusConfig[status as keyof typeof statusConfig] ||
            { label: status, color: "bg-gray-100 text-gray-800" };
    };

    const getFlexologistStatus = (status: number) => {
        return status === 1
            ? { label: "Active", color: "bg-green-100 text-green-800" }
            : { label: "Inactive", color: "bg-red-100 text-red-800" };
    };
    return (
        <Modal show={isOpen} onClose={onClose} size="xl">
            <div className=" md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Business Details
                </h2>

                {isLoading ? (
                    <BusinessDetailSkeleton />
                ) : businessInfo ? (
                    <div className="space-y-6">
                        <div className="bg-[#F5F5F5] p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Business Username</label>
                                    <p className="text-gray-900 font-medium">{businessInfo.business_username}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Created At</label>
                                    <p className="text-gray-900">{formatDate(businessInfo.business_created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Flexologists Count</label>
                                    <p className="text-gray-900 font-medium">{businessInfo.business_flexologists_count}</p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Information */}
                        <div className="bg-[#F5F5F5] p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Note Subscription</label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(businessInfo.business_note_sub_status).color}`}>
                                            {getStatusBadge(businessInfo.business_note_sub_status).label}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">RPA Subscription</label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(businessInfo.business_rpa_sub_status).color}`}>
                                            {getStatusBadge(businessInfo.business_rpa_sub_status).label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RPA Subscription Details */}
                            {businessInfo.business_rpa_sub_details && (
                                <div className="mt-4 p-4 bg-white rounded-lg border">
                                    <h4 className="text-md font-semibold text-gray-900 mb-3">RPA Subscription Details</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Price</label>
                                            <p className="text-gray-900">${businessInfo.business_rpa_sub_details.price / 100}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Quantity</label>
                                            <p className="text-gray-900">{businessInfo.business_rpa_sub_details.quantity}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Interval</label>
                                            <p className="text-gray-900 capitalize">{businessInfo.business_rpa_sub_details.interval}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Currency</label>
                                            <p className="text-gray-900 uppercase">{businessInfo.business_rpa_sub_details.currency}</p>
                                        </div> 
                                        {/* <div>
                                            <label className="text-sm font-medium text-gray-600">Start Date</label>
                                            <p className="text-gray-900">{formatTimestamp(businessInfo.business_rpa_sub_details.start_date)}</p>
                                        </div> */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">{businessInfo.business_rpa_sub_status === "trialing" ? "Trial Ends" : businessInfo.business_rpa_sub_status === "canceled" ? "Cancelled" : "Next Billing Date:"}</label>
                                            {businessInfo.business_rpa_sub_status !== "canceled" && <p className="text-gray-900">{formatTimestamp(businessInfo.business_rpa_sub_details.end_date)}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Note Subscription Details */}
                            {businessInfo.business_note_sub_details && (
                                <div className="mt-4 p-4 bg-white rounded-lg border">
                                    <h4 className="text-md font-semibold text-gray-900 mb-3">Note Subscription Details</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Price</label>
                                            <p className="text-gray-900">${businessInfo.business_note_sub_details.price / 100}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Quantity</label>
                                            <p className="text-gray-900">{businessInfo.business_note_sub_details.quantity}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Interval</label>
                                            <p className="text-gray-900 capitalize">{businessInfo.business_note_sub_details.interval}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Currency</label>
                                            <p className="text-gray-900 uppercase">{businessInfo.business_note_sub_details.currency}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">{businessInfo.business_note_sub_status === "trialing" ? "Trial Ends" : businessInfo.business_note_sub_status === "canceled" ? "Cancelled" : "Next Billing Date:"}</label>
                                            {businessInfo.business_note_sub_status !== "canceled" && <p className="text-gray-900">{formatTimestamp(businessInfo.business_note_sub_details.end_date)}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Locations */}
                        <div className="bg-[#F5F5F5] p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Locations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">All Locations</label>
                                    {businessInfo.business_all_locations ? <div className="space-y-1">
                                        {businessInfo.business_all_locations?.map((location, index) => (
                                            <div key={index} className="text-gray-900 bg-white px-3 py-2 rounded border text-sm">
                                                {location}
                                            </div>
                                        ))}
                                    </div> : <p className="text-gray-600 text-xs font-medium px-2 italic">
                                        No locations found
                                    </p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">Selected Locations</label>
                                    {businessInfo.business_selected_locations ? <div className="space-y-1">
                                        {businessInfo.business_selected_locations?.map((location, index) => (
                                            <div key={index} className="text-gray-900 bg-white px-3 py-2 rounded border text-sm">
                                                {location}
                                            </div>
                                        ))}
                                    </div> : <p className="text-gray-600 text-xs font-medium px-2 italic">
                                        No Selected locations found
                                    </p>}
                                </div>
                            </div>
                        </div>

                        {businessInfo.business_flexologists_info.filter(flexologist => flexologist.status === 1).length > 0 && (
                            <div className="bg-[#F5F5F5] p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flexologists</h3>
                                <div className="space-y-3">
                                    {businessInfo.business_flexologists_info
                                        .filter(flexologist => flexologist.status === 1)
                                        .map((flexologist) => (
                                            <div key={flexologist.id} className="bg-white p-4 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="hidden sm:flex w-10 h-10 rounded-full overflow-hidden bg-gray-300 items-center justify-center">
                                                            {flexologist.profile_picture_url ? (
                                                                <img
                                                                    src={flexologist.profile_picture_url}
                                                                    alt={flexologist.full_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {flexologist?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{flexologist.full_name}</p>
                                                            <p className="text-sm text-gray-600">Last login: {flexologist.last_login ? formatDate(flexologist.last_login) : "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFlexologistStatus(flexologist.status).color}`}>
                                                        {getFlexologistStatus(flexologist.status).label}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 flex items-center justify-center flex-col">
                        <div className="text-red-500 mb-2">Failed to load business details</div>
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        )}
                    </div>
                )}
                {businessInfo?.locations_summary && businessInfo.locations_summary.length > 0 && (
                    <div className="bg-[#F5F5F5] p-4 rounded-lg mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Locations Summary</h3>
                        <div className="space-y-6">
                            {businessInfo.locations_summary.map((loc, index) => (
                                <div key={index} className="bg-white rounded-lg border p-4 shadow-sm">
                                    {/* Location Header */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                        <h4 className="text-md font-semibold text-gray-900 capitalize">{loc.location}</h4>
                                        <div className="flex space-x-4 mt-2 md:mt-0">
                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Total Bookings:</span>{" "}
                                                <span className="text-gray-900 font-semibold">{loc.total_bookings_in_location}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Submitted:</span>{" "}
                                                <span className="text-gray-900 font-semibold">{loc.total_submitted_by_location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flexologists */}
                                    {loc.flexologists && loc.flexologists.length > 0 ? (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {loc.flexologists.map((flex, fIndex) => (
                                                <div key={fIndex} className="p-3 rounded-lg border bg-gray-50">
                                                    <p className="font-medium text-gray-900">{flex.name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium text-gray-700">Bookings:</span> {flex.total_bookings}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-700">Submitted With App:</span> {flex.total_submitted}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic mt-2">No flexologist data available</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </Modal>
    );
}; 
