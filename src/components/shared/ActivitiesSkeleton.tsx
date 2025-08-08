import { Skeleton } from "@/components/ui/skeleton";

export const ActivitiesSkeleton = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 bg-white">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 mb-2" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 bg-white">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
