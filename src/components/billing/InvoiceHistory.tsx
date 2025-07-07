interface InvoiceHistoryProps {
  flexologistQuantity: number;
  flexologistPrice: number;
  rpaPrice: number;
  noteTakingBillingDate: string | null;
  rpaBillingDate: string | null;
  flexologistStatus: string | undefined;
  rpaStatus: string | undefined;
}

export const InvoiceHistory = ({ 
  flexologistQuantity, 
  flexologistPrice, 
  rpaPrice, 
  noteTakingBillingDate, 
  rpaBillingDate,
  flexologistStatus,
  rpaStatus
}: InvoiceHistoryProps) => {
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Invoice History</h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div>
          <div className="text-gray-600 mb-2 text-sm">Active Flexologists:</div>
          <div className="font-medium text-gray-900 text-base">{flexologistQuantity}</div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div>
            <div className="text-gray-600 mb-2 text-sm">Subscription Tier:</div>
            <div className="font-medium text-gray-900 text-base">
              ${flexologistPrice}/month per Flexologist
            </div>
          </div>
          
          {noteTakingBillingDate && (
            <div>
              <div className="text-gray-600 mb-2 text-sm">
                {flexologistStatus === "trialing" ? "Trial Ends:" : flexologistStatus === "canceled" ? "Cancelled" : "Next Billing Date:"}
              </div>
             { flexologistStatus !== "cancel" && <div className="font-medium text-gray-900 text-base">
                {noteTakingBillingDate}
              </div>}
            </div>
          )}
        </div>
        
        <div className="pt-3 sm:pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <div className="text-gray-600 mb-2 text-sm">RPA Automation Add-on:</div>
              <div className="font-medium text-gray-900 text-base">
                Enabled-${rpaPrice}/month per location
              </div>
            </div>
            
            {rpaBillingDate && (
              <div>
                <div className="text-gray-600 mb-2 text-sm">
                  {rpaStatus === "trialing" ? "Trial Ends:" : rpaStatus === "canceled" ? "Cancelled" : "  Next Billing Date:"}
                </div>
                {rpaStatus !== "cancel" && <div className="font-medium text-gray-900 text-base">
                  {rpaBillingDate}
                </div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 