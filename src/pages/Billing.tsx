import { ContainLoader } from "@/components/shared";
import { ErrorHandle } from "@/components/app";
import { useBilling } from "@/hooks/useBilling";
import { BillingEmptyState, InvoiceHistory, MonthlyCharges } from "@/components/billing";

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
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl ">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        </div>

        {!hasSubscriptionData ? (
          <BillingEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InvoiceHistory
              flexologistQuantity={flexologistQuantity}
              flexologistPrice={flexologistPrice}
              rpaPrice={rpaPrice}
              noteTakingBillingDate={noteTakingBillingDate}
              rpaBillingDate={rpaBillingDate}
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
        )}
      </div>
    </div>
  );
}; 