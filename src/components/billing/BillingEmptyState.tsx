export const BillingEmptyState = () => {
  return (
    <div className="bg-[#E1EEF0] rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing Data Available</h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto">
        We couldn't find any subscription details for your account. Please check your subscription status.
      </p>
    </div>
  );
}; 