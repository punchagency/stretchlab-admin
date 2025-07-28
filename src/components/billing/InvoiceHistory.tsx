import { useState } from "react";
import { Button, ConfirmModal, SvgIcon } from "@/components/shared";
import { cancelSubscription } from "@/service/payment";
import { renderErrorToast, renderSuccessToast } from "../utils";
import type { ApiError } from "@/types/response";

interface InvoiceHistoryProps {
  flexologistQuantity: number;
  flexologistPrice: number;
  rpaPrice: number;
  noteTakingBillingDate: string | null;
  rpaBillingDate: string | null;
  flexologistStatus: string | undefined;
  rpaStatus: string | undefined;
  rpaQuantity: number;
  onRefresh?: () => void;
}

export const InvoiceHistory = ({ 
  flexologistQuantity, 
  flexologistPrice, 
  rpaPrice, 
  noteTakingBillingDate, 
  rpaBillingDate,
  flexologistStatus,
  rpaStatus,
  rpaQuantity,
  onRefresh
}: InvoiceHistoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<"note_taking" | "robot_process_automation" | null>(null);

  const handleCancelSubscription = async (type: "note_taking" | "robot_process_automation") => {
    setSubscriptionToCancel(type);
    setShowConfirmModal(true);
  };

  const confirmCancelSubscription = async () => {
    if (!subscriptionToCancel) return;
    
    setIsLoading(true);
    try {
      await cancelSubscription(subscriptionToCancel);
      renderSuccessToast(`${subscriptionToCancel === "note_taking" ? "Note Taking" : "RPA Automation"} subscription cancelled successfully`);
      setShowConfirmModal(false);
      setSubscriptionToCancel(null);
      onRefresh?.();
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast( apiError.response.data.message || "Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowConfirmModal(false);
    setSubscriptionToCancel(null);
  };
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Invoice Information</h2>
      
      <div className="space-y-4 sm:space-y-5">
      { flexologistQuantity > 0 && <div>
          <div className="text-gray-600 mb-2 text-sm">Active Flexologists:</div>
          <div className="font-medium text-gray-900 text-base">{flexologistQuantity}</div>
        </div>}
        
       { flexologistQuantity > 0 && <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
              { flexologistStatus !== "canceled" && <div className="font-medium text-gray-900 text-base">
                {noteTakingBillingDate}
              </div>}
            </div>
          )}
          
          {flexologistStatus !== "canceled" && (
            <Button
              onClick={() => handleCancelSubscription("note_taking")}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
            >
              <SvgIcon name="cancel" width={16} height={16} fill="white" />
              {isLoading && subscriptionToCancel === "note_taking" ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </div>}

        
        {rpaQuantity > 0 && <div className="pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="text-gray-600 mb-2 text-sm">RPA Automation Add-on:</div>
              <div className="font-medium text-gray-900 text-base">
                Enabled-${rpaPrice}/month per location
              </div>
            </div>
            
            {rpaBillingDate && (
              <div>
                <div className="text-gray-600 mb-2 text-sm">
                  {rpaStatus === "trialing" ? "Trial Ends:" : rpaStatus === "canceled" ? "Cancelled" : "Next Billing Date:"}
                </div>
                {rpaStatus !== "canceled" && <div className="font-medium text-gray-900 text-base">
                  {rpaBillingDate}
                </div>}
              </div>
            )}
            
            {rpaStatus !== "canceled" && (
              <Button
                onClick={() => handleCancelSubscription("robot_process_automation")}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
              >
                <SvgIcon name="cancel" width={16} height={16} fill="white" />
                {isLoading && subscriptionToCancel === "robot_process_automation" ? "Cancelling..." : "Cancel"}
              </Button>
            )}
          </div>

        </div>}
      </div>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleModalClose}
        onConfirm={confirmCancelSubscription}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel your ${subscriptionToCancel === "note_taking" ? "Note Taking" : "RPA Automation"} subscription? This action cannot be undone.`}
        loading={isLoading}
        error={false}
      />
    </div>
  );
}; 