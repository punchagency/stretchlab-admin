import { useState } from "react";
import { Button, ConfirmModal, SvgIcon } from "@/components/shared";
import { cancelSubscription, restartSubscription } from "@/service/payment";
import { renderErrorToast, renderSuccessToast } from "../utils";
import type { ApiError } from "@/types/response";
import { CheckCircle } from "lucide-react";
import { formatBillingDate } from "@/utils";

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
  rpaData: any;
  noteTakingData: any
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
  onRefresh,
  rpaData,
  noteTakingData
}: InvoiceHistoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subscriptionToModify, setSubscriptionToModify] = useState<"note_taking" | "robot_process_automation" | null>(null);
  const [actionType, setActionType] = useState<"cancel" | "restart" | null>(null);

  const handleCancelSubscription = async (type: "note_taking" | "robot_process_automation") => {
    setSubscriptionToModify(type);
    setActionType("cancel");
    setShowConfirmModal(true);
  };

  const handleRestartSubscription = async (type: "note_taking" | "robot_process_automation") => {
    setSubscriptionToModify(type);
    setActionType("restart");
    setShowConfirmModal(true);
  };

  const confirmSubscriptionAction = async () => {
    if (!subscriptionToModify || !actionType) return;

    setIsLoading(true);
    try {
      if (actionType === "cancel") {
        await cancelSubscription(subscriptionToModify);
        renderSuccessToast(`${subscriptionToModify === "note_taking" ? "Note Taking" : "RPA Automation"} subscription cancelled successfully`);
      } else {
        await restartSubscription(subscriptionToModify);
        renderSuccessToast(`${subscriptionToModify === "note_taking" ? "Note Taking" : "RPA Automation"} subscription restarted successfully`);
      }
      setShowConfirmModal(false);
      setSubscriptionToModify(null);
      setActionType(null);
      onRefresh?.();
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message || `Failed to ${actionType} subscription. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowConfirmModal(false);
    setSubscriptionToModify(null);
    setActionType(null);
  };
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Invoice Information</h2>

      <div className="space-y-4 sm:space-y-5">
        {flexologistQuantity > 0 && <div>
          <div className="text-gray-600 mb-2 text-sm">Active Flexologists:</div>
          <div className="font-medium text-gray-900 text-base">{flexologistQuantity}</div>
        </div>}

        {flexologistQuantity > 0 && <> <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
              {flexologistStatus !== "canceled" && <div className="font-medium text-gray-900 text-base">
                { noteTakingData.discount ? formatBillingDate(noteTakingData?.discount_info?.end_date)  :noteTakingBillingDate}
              </div>}
            </div>
          )}

          {flexologistStatus === "canceled" ? (
            <Button
              onClick={() => handleRestartSubscription("note_taking")}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
            >
              <CheckCircle width={16} height={16} />
              {isLoading && subscriptionToModify === "note_taking" && actionType === "restart" ? "Restarting..." : "Restart"}
            </Button>
          ) : (
            <Button
              onClick={() => handleCancelSubscription("note_taking")}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
            >
              <SvgIcon name="cancel" width={16} height={16} fill="white" />
              {isLoading && subscriptionToModify === "note_taking" && actionType === "cancel" ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </div>
          {noteTakingData.discount && <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
            <div className="text-orange-900 text-xs font-medium">
              The Note Taking plan currently has a {noteTakingData?.discount_info?.percent_off}% discount applied,
              valid until {formatBillingDate(noteTakingData?.discount_info?.end_date)}.
            </div>
          </div>}
        </>}


        {rpaQuantity > 0 && <> <div className="pt-3 sm:pt-4">
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
                  {rpaData.discount ? formatBillingDate(rpaData?.discount_info?.end_date) : rpaBillingDate}
                  
                </div>}
              </div>
            )}

            {rpaStatus === "canceled" ? (
              <Button
                onClick={() => handleRestartSubscription("robot_process_automation")}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
              >
                <CheckCircle width={16} height={16} />
                {isLoading && subscriptionToModify === "robot_process_automation" && actionType === "restart" ? "Restarting..." : "Restart"}
              </Button>
            ) : (
              <Button
                onClick={() => handleCancelSubscription("robot_process_automation")}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md w-fit flex items-center gap-2"
              >
                <SvgIcon name="cancel" width={16} height={16} fill="white" />
                {isLoading && subscriptionToModify === "robot_process_automation" && actionType === "cancel" ? "Cancelling..." : "Cancel"}
              </Button>
            )}
          </div>

        </div> {rpaData.discount && <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
          <div className="text-orange-900 text-xs font-medium">
            The RPA plan currently has a {rpaData?.discount_info?.percent_off}% discount applied,
            valid until {formatBillingDate(rpaData?.discount_info?.end_date)}.
          </div>
        </div>}</>}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleModalClose}
        onConfirm={confirmSubscriptionAction}
        title={actionType === "cancel" ? "Cancel Subscription" : "Restart Subscription"}
        message={`Are you sure you want to ${actionType} your ${subscriptionToModify === "note_taking" ? "Note Taking" : "RPA Automation"} subscription?${actionType === "cancel" ? " This action cannot be undone." : "Billing will resume immediately when you restart your subscription."}`}
        loading={isLoading}
        error={false}
      />
    </div>
  );
}; 