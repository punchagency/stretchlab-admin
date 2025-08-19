import React, { useState, useMemo } from 'react';
import {
  Users,
  MapPin,
  FileText,
  BarChart3,
  RefreshCcw,
} from 'lucide-react';
import { Button, Input } from "@/components/shared";
import { ActivitiesSkeleton, DataSection } from "./index";
import type { ActivitiesData } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [searchQuery, setSearchQuery] = useState('');
  
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const sortEntries = (obj: Record<string, number>) =>
    Object.entries(obj).sort(([, a], [, b]) => b - a);

  const filterEntries = (entries: [string, number][]) => {
    if (!searchQuery.trim()) return entries;
    
    return entries.filter(([name]) => 
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const flexologistEntries = useMemo(() => 
    data ? filterEntries(sortEntries(data.notes_analysed_per_flexologist)) : [], 
    [data?.notes_analysed_per_flexologist, searchQuery]
  );
  
  const locationEntries = useMemo(() => 
    data ? filterEntries(sortEntries(data.notes_analysed_per_location)) : [], 
    [data?.notes_analysed_per_location, searchQuery]
  );
  
  const flexologistSubmittedEntries = useMemo(() => 
    data ? filterEntries(sortEntries(data.notes_submitted_per_flexologist)) : [], 
    [data?.notes_submitted_per_flexologist, searchQuery]
  );
  
  const locationSubmittedEntries = useMemo(() => 
    data ? filterEntries(sortEntries(data.notes_submitted_per_location)) : [], 
    [data?.notes_submitted_per_location, searchQuery]
  );

  React.useEffect(() => {
    setFlexologistPage(0);
    setLocationPage(0);
    setFlexologistSubmittedPage(0);
    setLocationSubmittedPage(0);
  }, [searchQuery]);

  if (isLoading) return <ActivitiesSkeleton />;

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

  const totalPages = (length: number) => Math.ceil(length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search flexologists and locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon="search"
          className="w-full rounded-md"
        />
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Showing results for <span className="font-bold text-gray-900">"{searchQuery}"</span>
          </div>
        )}
      </div>

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
          totalPages={totalPages(flexologistEntries.length)}
          onPageChange={dir => setFlexologistPage(p => p + (dir === 'next' ? 1 : -1))}
          icon={<Users className="w-4 h-4 text-blue-600" />}
          colorScheme="blue"
        />

        <DataSection
          title="Note Analysed By Location"
          items={locationEntries}
          currentPage={locationPage}
          totalPages={totalPages(locationEntries.length)}
          onPageChange={dir => setLocationPage(p => p + (dir === 'next' ? 1 : -1))}
          icon={<MapPin className="w-4 h-4 text-green-600" />}
          colorScheme="green"
        />
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center mb-2">
          <FileText className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Notes with App</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800">{data.notes_submitted_with_app.toLocaleString()}</p>
        <p className="text-xs text-gray-600 mt-1">Submitted via app</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
        <DataSection
          title="Note Submitted By Flexologist"
          items={flexologistSubmittedEntries}
          currentPage={flexologistSubmittedPage}
          totalPages={totalPages(flexologistSubmittedEntries.length)}
          onPageChange={dir => setFlexologistSubmittedPage(p => p + (dir === 'next' ? 1 : -1))}
          icon={<Users className="w-4 h-4 text-blue-600" />}
          colorScheme="blue"
        />

        <DataSection
          title="Note Submitted By Location"
          items={locationSubmittedEntries}
          currentPage={locationSubmittedPage}
          totalPages={totalPages(locationSubmittedEntries.length)}
          onPageChange={dir => setLocationSubmittedPage(p => p + (dir === 'next' ? 1 : -1))}
          icon={<MapPin className="w-4 h-4 text-green-600" />}
          colorScheme="green"
        />
      </div>
    </div>
  );
};

export default Activities;
