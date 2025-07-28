import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => {
    const barHeights = [40, 75, 35, 60, 85, 25, 70, 45, 55, 80, 30, 65];

    return (
        <div className="w-full h-64 sm:h-72 md:h-80 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="relative h-full">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-px bg-gray-200/60"></div>
                    ))}
                </div>

                <div className="relative h-full flex">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between pr-2 sm:pr-3 md:pr-6 w-6 sm:w-8 md:w-12 py-2">
                        <Skeleton className="h-2 sm:h-3 w-4 sm:w-6 md:w-8 bg-gray-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-3 sm:w-4 md:w-6 bg-gray-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-4 sm:w-6 md:w-8 bg-gray-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-3 sm:w-4 md:w-6 bg-gray-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-4 sm:w-6 md:w-8 bg-gray-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-2 sm:w-3 md:w-4 bg-gray-300/70" />
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex justify-between">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="w-px bg-gray-200/40 h-full"></div>
                            ))}
                        </div>

                        {/* Bar Chart */}
                        <div className="flex-1 flex items-end justify-between gap-0.5 sm:gap-1 md:gap-2 pb-4 sm:pb-6 px-1 sm:px-2 relative z-10">
                            {barHeights.map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center max-w-[25px] sm:max-w-[35px] md:max-w-[45px] lg:max-w-[55px]">
                                    <div
                                        className="w-full relative mb-1 sm:mb-2 rounded-t-sm sm:rounded-t-md shadow-sm"
                                        style={{ height: `${height}%` }}
                                    >
                                        <Skeleton className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-300 border border-blue-300/30 rounded-t-sm sm:rounded-t-md" />
                                        {/* Highlight effect - only show on larger screens */}
                                        <div className="hidden sm:block absolute top-0 left-0.5 w-0.5 sm:w-1 h-1/4 sm:h-1/3 bg-white/40 rounded-full"></div>
                                    </div>
                                    {/* Bar label */}
                                    <Skeleton className="h-1.5 sm:h-2 w-2 sm:w-3 md:w-4 bg-gray-300/60 mb-1 sm:mb-2" />
                                </div>
                            ))}
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between px-1 sm:px-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((_, index) => (
                                <div key={index} className="flex-1 flex justify-center max-w-[25px] sm:max-w-[35px] md:max-w-[45px] lg:max-w-[55px]">
                                    <Skeleton className="h-2 sm:h-3 w-3 sm:w-4 md:w-6 bg-gray-300/70" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend - Responsive positioning */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Skeleton className="h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-blue-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-6 sm:w-8 md:w-12 bg-gray-300/70" />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Skeleton className="h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-green-300/70" />
                        <Skeleton className="h-2 sm:h-3 w-8 sm:w-12 md:w-16 bg-gray-300/70" />
                    </div>
                </div>
            </div>
        </div>
    );
}; 