import { Skeleton } from "@/components/ui/skeleton";

export const DrilldownSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex justify-between text-xs font-medium bg-[#F7F9FC] p-2 rounded-sm border border-gray-200">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex justify-between text-xs font-medium bg-[#F7F9FC] p-2 rounded-sm border border-gray-200">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 