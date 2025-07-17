import React from 'react';
import { MetricCard } from '../shared';

interface MetricsDisplayProps {
  totalNotes: number;
  totalNotesWithOpportunities: number;
  totalQualityNotes: number;
  isLoading: boolean;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  totalNotes,
  totalNotesWithOpportunities,
  totalQualityNotes,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Notes",
      value: totalNotes.toLocaleString(),
      subtitle: "All notes analyzed",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Notes with Opportunities",
      value: totalNotesWithOpportunities.toLocaleString(),
      subtitle: "Notes requiring attention",
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Quality Notes",
      value: totalQualityNotes.toLocaleString(),
      subtitle: "High-quality notes",
      color: "bg-green-50 border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.color} border rounded-lg p-4 shadow-sm`}
        >
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {metric.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {metric.value}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metric.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}; 