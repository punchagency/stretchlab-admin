import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => {
    const barHeights = [40, 75, 35, 60, 85, 25, 70, 45, 55, 80, 30, 65];

    return (
        <div className="w-full h-[300px] p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="relative h-full">
                <div className="absolute inset-0 flex flex-col justify-between">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-px bg-gray-200/60"></div>
                    ))}
                </div>

                <div className="relative h-full flex">
                    <div className="flex flex-col justify-between pr-6 w-12 py-2">
                        <Skeleton className="h-3 w-8 bg-gray-300/70" />
                        <Skeleton className="h-3 w-6 bg-gray-300/70" />
                        <Skeleton className="h-3 w-8 bg-gray-300/70" />
                        <Skeleton className="h-3 w-6 bg-gray-300/70" />
                        <Skeleton className="h-3 w-8 bg-gray-300/70" />
                        <Skeleton className="h-3 w-4 bg-gray-300/70" />
                    </div>

                    <div className="flex-1 flex flex-col relative">
                        <div className="absolute inset-0 flex justify-between">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="w-px bg-gray-200/40 h-full"></div>
                            ))}
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-1 pb-6 px-1 relative z-10">
                            {barHeights.map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center max-w-[60px]">
                                    <div
                                        className="w-full relative mb-1 rounded-t-md shadow-sm"
                                        style={{ height: `${height}%` }}
                                    >
                                        <Skeleton className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-300 border border-blue-300/30 rounded-t-md" />

                                        <div className="absolute top-0 left-1 w-1 h-1/3 bg-white/40 rounded-full"></div>
                                    </div>

                                    <Skeleton className="h-2 w-6 bg-gray-300/60 mb-2" />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between px-1">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((_, index) => (
                                <div key={index} className="flex-1 flex justify-center max-w-[60px]">
                                    <Skeleton className="h-3 w-8 bg-gray-300/70" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="absolute top-4 right-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-blue-300/70" />
                        <Skeleton className="h-3 w-16 bg-gray-300/70" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-green-300/70" />
                        <Skeleton className="h-3 w-20 bg-gray-300/70" />
                    </div>
                </div>
            </div>
        </div>
    );
}; 