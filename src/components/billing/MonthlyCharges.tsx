interface MonthlyChargesProps {
  flexologistQuantity: number;
  flexologistPrice: number;
  flexologistTotal: number;
  rpaQuantity: number;
  rpaPrice: number;
  rpaTotal: number;
  totalBilled: number;
}

export const MonthlyCharges = ({ 
  flexologistQuantity, 
  flexologistPrice, 
  flexologistTotal, 
  rpaQuantity, 
  rpaPrice, 
  rpaTotal, 
  totalBilled 
}: MonthlyChargesProps) => {
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">This Month's Charges</h2>
      
      <div className="space-y-5">
        <div>
          <div className="text-gray-600 mb-2 text-sm">Flexologist Access:</div>
          <div className="font-medium text-gray-900 text-base">
            {flexologistQuantity} Flexologists × ${flexologistPrice} = ${flexologistTotal.toFixed(2)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-600 mb-2 text-sm">RPA Automation Add-on:</div>
          <div className="font-medium text-gray-900 text-base">
            {rpaQuantity} Locations × ${rpaPrice} = ${rpaTotal.toFixed(2)}
          </div>
        </div>
        
        <div className="pt-4">
          <div className="text-gray-600 mb-2 text-sm">Total Billed:</div>
          <div className="font-bold text-gray-900 text-base">${totalBilled.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}; 