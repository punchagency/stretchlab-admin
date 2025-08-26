import { SvgIcon } from "@/components/shared";

export const BillingEmptyState = () => {
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center text-center">
      <div className="text-gray-400 mb-4">
        <SvgIcon name="billing" width={48} height={48} />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No Billing Information Found</h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto">
        We couldn't locate any active billing details for your account. Please check your subscription status.
      </p>
    </div>
  );
}; 