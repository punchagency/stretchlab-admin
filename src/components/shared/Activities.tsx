import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Users,
    MapPin,
    FileText,
    BarChart3,
    RefreshCcw
} from 'lucide-react';
import { Button } from "@/components/shared";
import { ActivitiesSkeleton } from "./ActivitiesSkeleton";
import type { ActivitiesData } from "@/types";

interface ActivitiesProps {
    data: ActivitiesData | undefined;
    isLoading: boolean;
    error: any;
    onRetry: () => void;
}

const Activities: React.FC<ActivitiesProps> = ({ data, isLoading, error, onRetry }) => {
    const [flexologistPage, setFlexologistPage] = useState(0);
    const [locationPage, setLocationPage] = useState(0);
    const [flexologistSubmittedPage, setFlexologistSubmittedPage] = useState(0);
    const [locationSubmittedPage, setLocationSubmittedPage] = useState(0);
    const itemsPerPage = 5;

    if (isLoading) {
        return <ActivitiesSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-8 flex items-center justify-center flex-col">
                <div className="text-red-500 mb-2">Error loading activities</div>
                <Button
                    onClick={onRetry}
                    className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="py-4 px-3 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Activities</h2>
                <div className="text-center py-8 text-gray-500">
                    No activities data available
                </div>
            </div>
        );
    }

    const flexologistEntries = Object.entries(data.notes_analysed_per_flexologist)
        .sort(([, a], [, b]) => b - a);

    const locationEntries = Object.entries(data.notes_analysed_per_location)
        .sort(([, a], [, b]) => b - a);

    const flexologistSubmittedEntries = Object.entries(data.notes_submitted_per_flexologist)
        .sort(([, a], [, b]) => b - a);
    const locationSubmittedEntries = Object.entries(data.notes_submitted_per_location)
        .sort(([, a], [, b]) => b - a);

    const formatName = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const totalFlexologistPages = Math.ceil(flexologistEntries.length / itemsPerPage);
    const totalLocationPages = Math.ceil(locationEntries.length / itemsPerPage);
    const totalFlexologistSubmittedPages = Math.ceil(flexologistSubmittedEntries.length / itemsPerPage);
    const totalLocationSubmittedPages = Math.ceil(locationSubmittedEntries.length / itemsPerPage);

    const getPaginatedData = (items: [string, number][], page: number) => {
        const startIndex = page * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleFlexologistPageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && flexologistPage > 0) {
            setFlexologistPage(flexologistPage - 1);
        } else if (direction === 'next' && flexologistPage < totalFlexologistPages - 1) {
            setFlexologistPage(flexologistPage + 1);
        }
    };

    const handleLocationPageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && locationPage > 0) {
            setLocationPage(locationPage - 1);
        } else if (direction === 'next' && locationPage < totalLocationPages - 1) {
            setLocationPage(locationPage + 1);
        }
    };

    const handleFlexologistSubmittedPageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && flexologistSubmittedPage > 0) {
            setFlexologistSubmittedPage(flexologistSubmittedPage - 1);
        } else if (direction === 'next' && flexologistSubmittedPage < totalFlexologistSubmittedPages - 1) {
            setFlexologistSubmittedPage(flexologistSubmittedPage + 1);
        }
    };

    const handleLocationSubmittedPageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && locationSubmittedPage > 0) {
            setLocationSubmittedPage(locationSubmittedPage - 1);
        } else if (direction === 'next' && locationSubmittedPage < totalLocationSubmittedPages - 1) {
            setLocationSubmittedPage(locationSubmittedPage + 1);
        }
    };

    const PaginationControls = ({
        currentPage,
        totalPages,
        onPageChange
    }: {
        currentPage: number;
        totalPages: number;
        onPageChange: (direction: 'prev' | 'next') => void;
    }) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-3">
                <button
                    onClick={() => onPageChange('prev')}
                    disabled={currentPage === 0}
                    className={`p-1.5 rounded-md transition-colors ${currentPage === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 font-medium">
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange('next')}
                    disabled={currentPage === totalPages - 1}
                    className={`p-1.5 rounded-md transition-colors ${currentPage === totalPages - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    const DataSection = ({
        title,
        items,
        currentPage,
        totalPages,
        onPageChange,
        icon,
        colorScheme,
    }: {
        title: string;
        items: [string, number][];
        currentPage: number;
        totalPages: number;
        onPageChange: (direction: 'prev' | 'next') => void;
        icon: React.ReactNode;
        colorScheme: 'blue' | 'green';
    }) => {
        const colorClasses = {
            blue: {
                header: 'text-blue-700 bg-blue-50 border-blue-200',
                item: 'bg-blue-50/50 border-blue-100 hover:bg-blue-100/70',
                badge: 'bg-blue-100 text-blue-800'
            },
            green: {
                header: 'text-green-700 bg-green-50 border-green-200',
                item: 'bg-green-50/50 border-green-100 hover:bg-green-100/70',
                badge: 'bg-green-100 text-green-800'
            }
        };

        const colors = colorClasses[colorScheme];
        return (
            <div className="space-y-3">
                <div className={`flex items-center gap-2 p-2 rounded-lg border ${colors.header}`}>
                    {icon}
                    <h4 className="md:text-sm text-xs font-semibold">{title}</h4>
                    <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {items.length > 0 ? (
                    <div className="space-y-2">
                        {getPaginatedData(items, currentPage).map(([name, count]) => (
                            <div
                                key={name}
                                className={`flex justify-between items-center p-2 rounded-lg border ${colors.item}`}
                            >
                                <span className="text-xs font-medium text-gray-700 truncate flex-1 mr-3">
                                    {formatName(name)}
                                </span>
                                <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded-md border">
                                    {count.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-sm font-medium">No {title.toLowerCase()} data available</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div >


            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-12">
                {/* Summary Cards */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center mb-2">
                            <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-900">Total Analysed</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{data.total_analysed_bookings.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Total Analysed Bookings</p>
                    </div>



                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <DataSection
                            title="Note Analysed By Flexologist"
                            items={flexologistEntries}
                            currentPage={flexologistPage}
                            totalPages={totalFlexologistPages}
                            onPageChange={handleFlexologistPageChange}
                            icon={<Users className="w-4 h-4 text-blue-600" />}
                            colorScheme="blue"
                        />

                        <DataSection
                            title="Note Analysed By Location"
                            items={locationEntries}
                            currentPage={locationPage}
                            totalPages={totalLocationPages}
                            onPageChange={handleLocationPageChange}
                            icon={<MapPin className="w-4 h-4 text-green-600" />}
                            colorScheme="green"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center mb-2">
                            <FileText className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-900">Notes with App</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{data.notes_submitted_with_app.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Submitted via app</p>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <DataSection
                            title="Note Submitted By Flexologist"
                            items={flexologistSubmittedEntries}
                            currentPage={flexologistSubmittedPage}
                            totalPages={totalFlexologistSubmittedPages}
                            onPageChange={handleFlexologistSubmittedPageChange}
                            icon={<Users className="w-4 h-4 text-blue-600" />}
                            colorScheme="blue"
                        />

                        <DataSection
                            title="Note Submitted By Location"
                            items={locationSubmittedEntries}
                            currentPage={locationSubmittedPage}
                            totalPages={totalLocationSubmittedPages}
                            onPageChange={handleLocationSubmittedPageChange}
                            icon={<MapPin className="w-4 h-4 text-green-600" />}
                            colorScheme="green"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;
