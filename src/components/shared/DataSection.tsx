import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataSectionProps {
  title: string;
  items: [string, number][];
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'prev' | 'next') => void;
  icon: React.ReactNode;
  colorScheme: 'blue' | 'green';
}

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'prev' | 'next') => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-3">
      <button
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 0}
        className={`p-1.5 rounded-md transition-colors ${
          currentPage === 0
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
        className={`p-1.5 rounded-md transition-colors ${
          currentPage === totalPages - 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export const DataSection: React.FC<DataSectionProps> = ({
  title,
  items,
  currentPage,
  totalPages,
  onPageChange,
  icon,
  colorScheme,
}) => {
      const isMobile = useIsMobile();
      const itemsPerPage = isMobile ? 5 : 10;
  const startIndex = currentPage * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const colors = {
    blue: {
      header: 'text-blue-700 bg-blue-50 border-blue-200',
      item: 'bg-blue-50/50 border-blue-100 hover:bg-blue-100/70',
      badge: 'bg-blue-100 text-blue-800',
    },
    green: {
      header: 'text-green-700 bg-green-50 border-green-200',
      item: 'bg-green-50/50 border-green-100 hover:bg-green-100/70',
      badge: 'bg-green-100 text-green-800',
    },
  }[colorScheme];

  const formatName = (name: string) =>
    name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 p-2 rounded-lg border ${colors.header}`}>
        {icon}
        <h4 className="md:text-sm text-xs font-semibold">{title}</h4>
        <span
          className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}
        >
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {paginatedItems.map(([name, count]) => (
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
