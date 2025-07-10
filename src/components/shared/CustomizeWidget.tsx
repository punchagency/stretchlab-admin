interface CustomizeWidgetProps {
  onEditClick?: () => void;
}

export const CustomizeWidget = ({ onEditClick }: CustomizeWidgetProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Widgets</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Rearrange Or Add Dashboard Metrics
        </p>
        
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}; 