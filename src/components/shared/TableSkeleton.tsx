export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
  return (
    <div className="p-2">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="grid grid-cols-4 gap-4 p-4 border-b bg-gray-50">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={`header-${index}`} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 p-4 border-b">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`h-4 bg-gray-300 rounded ${colIndex === 0 ? 'w-3/4' :
                      colIndex === 1 ? 'w-full' :
                        colIndex === 2 ? 'w-2/3' : 'w-1/2'
                    }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};