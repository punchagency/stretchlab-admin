import React, { useState } from 'react';
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

  const getPaginatedData = (items: any[], page: number) => {
    const startIndex = page * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
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
          className={`p-1 rounded ${currentPage === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs text-gray-500">
          {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange('next')}
          disabled={currentPage === totalPages - 1}
          className={`p-1 rounded ${currentPage === totalPages - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Drill-Down: <span className="text-primary-base">{selected || 'Overview'}</span>
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">By Location</h4>
          {data.locations.length > 0 ?  <div className='flex flex-col gap-2'>
            {getPaginatedData(data.locations, locationPage).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs font-medium bg-[#F7F9FC] p-2 rounded-sm border border-gray-200">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div> : <div>
            <p className='text-gray-500 text-sm font-medium'>No Location Data</p>
          </div>}
          <PaginationControls
            currentPage={locationPage}
            totalPages={totalLocationPages}
            onPageChange={handleLocationPageChange}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">By Flexologist</h4>
          {data.flexologists.length > 0 ? <div className='flex flex-col gap-2'>
            {getPaginatedData(data.flexologists, flexologistPage).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs font-medium bg-[#F7F9FC] p-2 rounded-sm border border-gray-200">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div> : <div >
            <p className='text-gray-500 text-sm font-medium'>No Flexologist Data</p>
          </div>}
          <PaginationControls
            currentPage={flexologistPage}
            totalPages={totalFlexologistPages}
            onPageChange={handleFlexologistPageChange}
          />
        </div>
      </div>
    </div>
  );
}; 