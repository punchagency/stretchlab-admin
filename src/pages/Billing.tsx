import { ContainLoader } from "@/components/shared";
import { ErrorHandle, PaymentCollection } from "@/components/app";
import { useBilling } from "@/hooks/useBilling";
import { BillingEmptyState, InvoiceHistory, MonthlyCharges, InvoiceHistoryTable } from "@/components/billing";
import { usePaymentInfo } from "@/service/payment";
import { useState } from "react";

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

  const { data: paymentInfo, isLoading: isPaymentLoading } = usePaymentInfo();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [, setProceed] = useState(false);

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
          <div className="bg-[#F8FAFC] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              {paymentInfo && <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-primary-base hover:bg-primary-dark text-white text-sm font-medium py-2 px-3 rounded-md"
              >
                Update Payment Details
              </button>}
            </div>
            {isPaymentLoading ? (
              <div className="h-16 bg-gray-100 rounded-md animate-pulse" />
            ) : paymentInfo ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="py-1 px-2 bg-gray-200 rounded flex items-center justify-center">
                    {paymentInfo.type === "card" ? (
                      paymentInfo.brand?.toLowerCase?.() === "visa" ? (
                        <span className="text-blue-600 font-bold">VISA</span>
                      ) : (
                        <span className="text-gray-600 font-bold ">
                          {(paymentInfo.brand || "Card").toUpperCase()}
                        </span>
                      )
                    ) : (
                      <span className="text-gray-600 font-bold">
                        {paymentInfo.type?.toUpperCase() || "OTHER"}
                      </span>
                    )}
                  </div>

                  <div>
                    {paymentInfo.type === "card" ? (
                      <>
                        <p className="font-medium">•••• {paymentInfo.last4}</p>
                        <p className="text-sm text-gray-500">
                          Expires {paymentInfo.exp_month}/{paymentInfo.exp_year}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 capitalize font-semibold">
                        {paymentInfo.type} payment method
                      </p>
                    )}
                  </div>
                </div>
                {paymentInfo.name && (
                  <p className="text-sm text-gray-600">Name: {paymentInfo.name}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No payment method added yet.</p>
            )}
          </div>
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
      {showPaymentModal && (
        <PaymentCollection
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          robot={false}
          billingInfo={null}
          update={update}
          setUpdate={setUpdate}
          setProceed={setProceed}
          updateInfo={true}
        />
      )}
    </div>
  );
};