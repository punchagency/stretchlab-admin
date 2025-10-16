import { ContainLoader } from "@/components/shared";
import { ErrorHandle } from "@/components/app";
import { useBilling } from "@/hooks/useBilling";
import { BillingEmptyState, InvoiceHistory, MonthlyCharges, InvoiceHistoryTable } from "@/components/billing";

export const Billing = () => {
  const {
    flexologistQuantity,
    flexologistPrice,
    flexologistTotal,
    rpaQuantity,
    rpaPrice,
    rpaTotal,
    totalBilled,
    noteTakingBillingDate,
    rpaBillingDate,
    hasSubscriptionData,
    isLoading,
    error,
    refetch,
    flexologistStatus,
    rpaStatus,
    noteTakingData,
    rpaData
  } = useBilling(); 

  if (isLoading) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Loading billing details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%]">
        <ErrorHandle retry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 min-h-screen bg-white">
      <div className="">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {!hasSubscriptionData ? (
            <BillingEmptyState />
          ) : (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <InvoiceHistory
                  flexologistQuantity={flexologistQuantity}
                  flexologistPrice={flexologistPrice}
                  rpaPrice={rpaPrice}
                  noteTakingBillingDate={noteTakingBillingDate}
                  rpaBillingDate={rpaBillingDate}
                  flexologistStatus={flexologistStatus}
                  rpaStatus={rpaStatus}
                  rpaQuantity={rpaQuantity}
                  onRefresh={refetch}
                  noteTakingData={noteTakingData}
                  rpaData={rpaData}
                />

                <MonthlyCharges
                  flexologistQuantity={flexologistQuantity}
                  flexologistPrice={flexologistPrice}
                  flexologistTotal={flexologistTotal}
                  rpaQuantity={rpaQuantity}
                  rpaPrice={rpaPrice}
                  rpaTotal={rpaTotal}
                  totalBilled={totalBilled}
                />
              </div>
            </div>
          )}
          <InvoiceHistoryTable />
        </div>
      </div>
    </div>
  );
}; 