import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MapPin,
  User,
  Info
} from 'lucide-react';
import { DrilldownSkeleton } from '../shared';
import type { DrilldownData } from '@/types/analytics';

interface DrilldownProps {
  selected: string | null;
  data: DrilldownData | null;
  isLoading: boolean;
  hasInitialData: boolean;
}

export const Drilldown: React.FC<DrilldownProps> = ({
  selected,
  data,
  isLoading,
}) => {
  const [locationPage, setLocationPage] = useState(0);
  const [flexologistPage, setFlexologistPage] = useState(0);
  const itemsPerPage = 5;

  if (isLoading) {
    return <DrilldownSkeleton />;
  }

  if (!data) {
    return null;
  }

  const totalLocationPages = Math.ceil(data.locations.length / itemsPerPage);
  const totalFlexologistPages = Math.ceil(data.flexologists.length / itemsPerPage);

  const sortItemsByPercentage = (items: any[]) => {
    return [...items].sort((a, b) => {
      // Extract numeric value from percentage string (e.g., "45.2%" -> 45.2)
      const aValue = parseFloat(a.value.replace('%', ''));
      const bValue = parseFloat(b.value.replace('%', ''));
      return bValue - aValue; // Sort in descending order (highest to lowest)
    });
  };

  const getPaginatedData = (items: any[], page: number) => {
    const sortedItems = sortItemsByPercentage(items);
    const startIndex = page * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleLocationPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && locationPage > 0) {
      setLocationPage(locationPage - 1);
    } else if (direction === 'next' && locationPage < totalLocationPages - 1) {
      setLocationPage(locationPage + 1);
    }
  };

  const handleFlexologistPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && flexologistPage > 0) {
      setFlexologistPage(flexologistPage - 1);
    } else if (direction === 'next' && flexologistPage < totalFlexologistPages - 1) {
      setFlexologistPage(flexologistPage + 1);
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
    colorScheme,
    icon
  }: {
    title: string;
    items: any[];
    currentPage: number;
    totalPages: number;
    onPageChange: (direction: 'prev' | 'next') => void;
    colorScheme: 'blue' | 'green';
    icon: React.ReactNode;
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
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${colors.header}`}>
          {icon}
          <h4 className=" md:text-sm text-xs font-semibold">{title}</h4>
          <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="space-y-2">
            {getPaginatedData(items, currentPage).map((item: any, idx: number) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${colors.item}`}
              >
                <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-3">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-md border">
                  {item.value}
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 md:p-4 p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-base/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-primary-base" />
          </div>
          <div>
            <h3 className=" md:text-lg text-base font-semibold text-gray-900">
              Drill-Down Analysis
            </h3>
            <p className=" md:text-sm text-xs text-gray-600">
              {selected ? (
                <>Percent of appointments with: <span className="font-medium text-primary-base">{selected}</span></>
              ) : (
                'Overall distribution across locations and flexologists'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="md:p-6 p-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <DataSection
            title="By Location"
            items={data.locations}
            currentPage={locationPage}
            totalPages={totalLocationPages}
            onPageChange={handleLocationPageChange}
            colorScheme="blue"
            icon={<MapPin className="w-4 h-4 text-blue-600" />}
          />

          <DataSection
            title="By Flexologist"
            items={data.flexologists}
            currentPage={flexologistPage}
            totalPages={totalFlexologistPages}
            onPageChange={handleFlexologistPageChange}
            colorScheme="green"
            icon={<User className="w-4 h-4 text-green-600" />}
          />
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-600" />
            <h4 className=" md:text-base text-sm font-semibold text-gray-800">Understanding Your Data</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-500 rounded-md">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h5 className=" md:text-base text-sm font-semibold text-blue-800 mb-1">Location Breakdown</h5>
                  <p className="md:text-sm text-xs text-blue-700 leading-relaxed">
                    {selected ? (
                      <>
                         Represent percent of appointments with opportunities marked by <strong>{selected}</strong> at the  location.
                      </>
                    ) : (
                      "Each percentage indicates the proportion of high-quality notes at the location"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-500 rounded-md">
                  <User className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h5 className=" md:text-base text-sm font-semibold text-green-800 mb-1">Flexologist Breakdown</h5>
                  <p className=" md:text-sm text-xs text-green-700 leading-relaxed">
                    {
                      selected ? (  
                        <>
                           Represent percent of appointments with opportunities marked by <strong>{selected}</strong> for the individual flexologist.
                        </>
                      ) : (
                        "Each percentage reflects the proportion of high-quality notes for the individual flexologist."
                      )
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};