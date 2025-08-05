import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RechartsBarChartProps {
  data: Array<{
    label: string;
    value: number;
    total?: number;
  }>;
  title?: string;
  maxValue?: number;
  dataSet?: string;
}

export const RechartsBarChart = ({ data, title, maxValue, dataSet }: RechartsBarChartProps) => {
  const safeData = data.filter(d => typeof d.value === 'number' && !isNaN(d.value));
  const max = maxValue || (safeData.length > 0 ? Math.max(...safeData.map(d => d.value)) : 100);

  const chartData = safeData.map(item => ({
    name: item.label,
    value: item.value,
    total: item.total,
  }));

  const CustomBar = (props: any) => {
    const { payload, x, y, width, height } = props;

    if (!payload || typeof payload.value !== 'number' || isNaN(payload.value) ||
      typeof x !== 'number' || isNaN(x) ||
      typeof y !== 'number' || isNaN(y) ||
      typeof width !== 'number' || isNaN(width) ||
      typeof height !== 'number' || isNaN(height) ||
      width <= 0 || height <= 0) {
      return <g />;
    }

    const fullHeight = (payload.value === 0 || max === 0) ? 0 : (height * max) / payload.value;

    const safeFullHeight = isNaN(fullHeight) || fullHeight < 0 ? 0 : Math.min(fullHeight, height * 2);
    const backgroundY = y + height - safeFullHeight;

    const brickHeight = 20;
    const numBricks = Math.floor(height / brickHeight);

    const bricks = [];
    for (let i = 0; i < numBricks; i++) {
      const brickY = y + height - (i + 1) * brickHeight;
      const gradientId = `brickGradient-${i}-${x}`;

      bricks.push(
        <g key={`brick-${i}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#1B59F8" />
              <stop offset="30%" stopColor="#1B59F8" />
              <stop offset="100%" stopColor="#1B59F8" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <rect
            x={x}
            y={brickY}
            width={width}
            height={brickHeight}
            fill={`url(#${gradientId})`}
          />
        </g>
      );
    }

    return (
      <g>
        {/* Background bar (full height to max value) */}
        <rect
          x={x}
          y={backgroundY}
          width={width}
          height={safeFullHeight}
          // fill="#F2F7FF"
          fill="transparent"
        />
        {/* Brick segments */}
        {bricks}
      </g>
    );
  };

  // Don't render chart if no valid data
  if (chartData.length === 0) {
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
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
            barCategoryGap="5%"
          >
            <CartesianGrid stroke='none' />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              // domain={[0, max]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={35}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ fontSize: 12 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-sm text-gray-600">
                        Value: {data.value}{dataSet === 'Total Client Visits' ? '' : '%'}
                      </p>
                      {data.total !== undefined && (
                        <p className="text-sm text-gray-600">
                          Total: {data.total}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="#1B59F8"
              maxBarSize={550}
              shape={CustomBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};