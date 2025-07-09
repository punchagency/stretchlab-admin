import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface RechartsBarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title?: string;
  maxValue?: number;
}

export const RechartsBarChart = ({ data, title, maxValue }: RechartsBarChartProps) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value,
  }));

  // Custom bar shape that renders background and foreground with brick effect
  const CustomBar = (props: any) => {
    const { fill, payload, x, y, width, height } = props;
    
    // Calculate background bar dimensions
    const fullHeight = (height * max) / payload.value;
    const backgroundY = y + height - fullHeight;
    
    // Brick configuration
    const brickHeight = 20; // Height of each brick
    const numBricks = Math.floor(height / brickHeight);
    
    // Create individual bricks with gradients
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
          height={fullHeight}
          fill="#F2F7FF"
        />
        {/* Brick segments */}
        {bricks}
      </g>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
            barCategoryGap="5%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              domain={[0, max]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={35}
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
