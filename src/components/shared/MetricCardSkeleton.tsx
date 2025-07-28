export const MetricCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-6 w-4 bg-gray-300 rounded"></div>
      </div>
      
      <div className="mb-3">
        <div className="h-8 bg-gray-300 rounded w-24 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
      
      <div className="h-9 bg-gray-300 rounded-md w-28"></div>
    </div>
  );
};

export const MetricCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>
  );
}; 