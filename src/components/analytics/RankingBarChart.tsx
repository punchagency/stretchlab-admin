import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList
} from 'recharts';
import { ChartSkeleton } from '../shared';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AnalyticsChartDataPoint } from '@/types/analytics';

const CustomTooltip = ({ active, payload, label, dataSet }: any) => {
  if (active && payload && payload.length) {
    const fullName = payload[0].payload?.fullName || label;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="text-gray-700 font-bold capitalize">{fullName}</p>
        <p className="text-gray-600">Value: {payload[0].value}{dataSet === 'Total Client Visits' ? '' : '%'}</p>
        <p className="text-gray-600">Total: {payload[0].payload?.total}</p>
      </div>
    );
  }
  return null;
};

const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface RankingBarChartProps {
  data: AnalyticsChartDataPoint[];
  isLoading: boolean;
  dataSet?: string;
  onBarClick: (name: string) => void;
  selectedLocation?: string | null;
}

export const RankingBarChart: React.FC<RankingBarChartProps> = ({
  data,
  isLoading,
  dataSet,
  onBarClick,
  selectedLocation
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No ranking data available</p>
      </div>
    );
  }

  const truncateLength = isMobile ? 15 : 27;
  const yAxisWidth = isMobile ? 100 :170;
  const fontSize = isMobile ? 11 : 12;
  const barSize = isMobile ? 25 : 35;

  const processedData = data.map(item => ({
    ...item,
    displayName: truncateText(item.name, truncateLength),
    fullName: item.name
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        layout="vertical"
        data={processedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        barSize={barSize}
        onClick={(data) => {
          if (data.activeLabel) {
            const originalData = processedData.find(item => item.displayName === data.activeLabel);
            if (originalData) {
              onBarClick(originalData.fullName);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={fontSize} fontWeight={500} />
        <YAxis 
          dataKey="displayName" 
          type="category" 
          width={yAxisWidth} 
          fontSize={fontSize} 
          style={{ textTransform: 'capitalize' }}
          tick={{ fontSize }}
        />
        <Tooltip 
          content={<CustomTooltip dataSet={dataSet} />} 
          cursor={false}
          labelFormatter={(label) => {
            const originalData = processedData.find(item => item.displayName === label);
            return originalData ? originalData.fullName : label;
          }}
        />
        <Bar dataKey="value">
          <LabelList dataKey="value" position="right" />
          {processedData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={_.fullName === selectedLocation ? '#68C9D2' : '#FF5B55'}
              fontSize={fontSize}
              style={{
                borderRadius: '10px',
                opacity: _.fullName === selectedLocation ? 1 : 0.8,
                transition: 'all 0.2s ease-in-out'
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}; 