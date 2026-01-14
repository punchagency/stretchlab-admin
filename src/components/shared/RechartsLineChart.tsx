import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    // Legend
} from 'recharts';

interface RechartsLineChartProps {
    data: any[];
    locations: string[];
    title?: string;
    maxValue?: number;
    dataSet?: string;
}

const colors = [
    "#1B59F8", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#06B6D4", "#EC4899", "#84CC16", "#6366F1", "#F97316",
    "#14B8A6", "#D946EF", "#EAB308", "#3B82F6", "#F43F5E"
];

const getDescription = (dataSet: string | undefined) => {
    switch (dataSet) {
        case "% App Submissions":
            return "App Submissions";

        case "Total Client Visits":
            return "Total Client Visits";

        case "Avg 1st Visit Quality %":
            return "Avg 1st Visit Quality %";

        case "Avg Subsequent Visit Quality %":
            return "Avg Subsequent Visit Quality %";

        case "Avg Aggregate Note Quality %":
            return "Avg Aggregate Note Quality %";

        case "Avg Note Quality %":
            return "Note Quality";

        default:
            return "";
    }
};

export const RechartsLineChart = ({ data, locations, title, maxValue, dataSet }: RechartsLineChartProps) => {

    if (!data || data.length === 0) {
        return (
            <div className="w-full">
                {title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
                )}
                <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
            )}

            <div className="h-[60vh]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            width={35}
                            domain={[0, maxValue ? (dataMax: number) => Math.max(dataMax, maxValue) : 'auto']}
                        />
                        <Tooltip
                            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                            <p className="font-medium text-gray-900 mb-2">{label}</p>

                                            {/* Individual Location Values */}
                                            {payload.map((entry: any, index: number) => (
                                                <div key={index} className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">{entry.name}:</span> {Math.round(entry.value)}{dataSet === 'Total Client Visits' ? '' : '%'}
                                                    </p>
                                                </div>
                                            ))}

                                            <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                                                {/* Aggregate Value / Description */}
                                                {/* Only show if we have a valid aggregate value and description */}
                                                {/* Removing aggregate check to match BarChart exactly if desired, but BarChart had value */}
                                                {getDescription(dataSet) && typeof data.value === 'number' && (
                                                    <p className="text-sm text-gray-600">
                                                        <strong>{getDescription(dataSet)} (Avg):</strong> {Math.round(data.value)}{dataSet === 'Total Client Visits' ? '' : '%'}
                                                    </p>
                                                )}

                                                {/* Total Record */}
                                                {data.total !== undefined && (
                                                    <p className="text-sm text-gray-600">
                                                        <strong>Total Record:</strong> {Math.round(data.total)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        {/* <Legend /> */}
                        {locations.map((location, index) => {
                            const dataKey = location.toLowerCase();
                            const color = colors[index % colors.length];

                            return (
                                <Line
                                    key={location}
                                    type="monotone"
                                    dataKey={dataKey}
                                    name={location}
                                    stroke={color}
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: color, strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    connectNulls
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
