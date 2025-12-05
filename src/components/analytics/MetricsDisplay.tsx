import React from 'react';

interface MetricsDisplayProps {
  totalNotes: number;
  totalNotesWithOpportunities: number;
  totalQualityNotes: number;
  totalNotesWithOpportunitiesPercentage: number;
  totalQualityNotesPercentage: number;
  isLoading: boolean;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  totalNotes,
  totalNotesWithOpportunities,
  totalQualityNotes,
  totalNotesWithOpportunitiesPercentage,
  totalQualityNotesPercentage,
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
      title: "Total",
      value: totalNotes.toLocaleString(),
      subtitle: "All appointments analyzed",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Opportunities",
      value: totalNotesWithOpportunities.toLocaleString(),
      percentage: totalNotesWithOpportunitiesPercentage,
      subtitle: "Appointments requiring attention",
      color: "bg-orange-50 border-orange-200",
      showPercentage: true
    },
    {
      title: "Rating ",
      value: totalQualityNotes.toLocaleString(),
      percentage: totalQualityNotesPercentage,
      subtitle: "Average appointment rating (%)",
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
            {metric.percentage ? (
              metric.showPercentage ? (
                <>
                  {metric.value}{" "}
                  <span className="text-xs text-gray-500">/ {Math.round(metric.percentage)}%</span>
                </>
              ) : (
                <span>{Math.round(metric.percentage)}%</span>
              )
            ) : (
              metric.value
            )}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {metric.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}; 