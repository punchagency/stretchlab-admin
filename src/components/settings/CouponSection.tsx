import { Button, Input, Spinner, FilterDropdown } from "@/components/shared";
import type { Coupon } from "@/types/settings";

interface CouponSectionProps {
  settingsData: any; 
}

export const CouponSection = ({ settingsData }: CouponSectionProps) => {
  const {
    coupons,
    couponFormData,
    isLoadingCoupons,
    isLoadingAddCoupon,
    handleCouponInputChange,
    handleCouponInputBlur,
    handleAddCoupon,
  } = settingsData;

  const handleCouponTypeChange = (value: string) => {
    handleCouponInputChange({
      target: { name: 'coupon_type', value }
    } as React.ChangeEvent<HTMLSelectElement>); 
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 sm:pb-4 px-3 sm:px-6">
        <h2 className="text-base text-gray-900 mb-1 font-semibold">
          Coupon Management
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Add and manage discount coupons for your services.
        </p>
      </div>

      {/* Add Coupon Form */}
      <div className="space-y-4 px-3 sm:px-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Add New Coupon</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Coupon Code"
              type="text"
              name="coupon_code"
              placeholder="Enter coupon code"
              value={couponFormData.coupon_code}
              onChange={handleCouponInputChange}
              className="py-3 rounded-md text-sm"
              labelStyle="text-sm font-medium"
              helperText="Promotion code from stripe"
              onBlur={handleCouponInputBlur}
            />

            <FilterDropdown
              label="Coupon Type"
              value={couponFormData.coupon_type}
              options={[
                { value: "all", label: "All" },
                { value: "robot", label: "Robot Automation" },
                { value: "note_taking", label: "Note Taking" }
              ]}
              onChange={handleCouponTypeChange}
              showLabel={true}
            />

            <Input
              label="Coupon Name"
              type="text"
              name="coupon_name"
              placeholder="Enter coupon name"
              value={couponFormData.coupon_name}
              onChange={handleCouponInputChange}
              className="py-3 rounded-md text-sm"
              labelStyle="text-sm font-medium"
              helperText="Coupon name from stripe"
              onBlur={handleCouponInputBlur}
            />

            <Input
              label="Coupon ID"
              type="text"
              name="coupon_id"
              placeholder="Enter coupon ID"
              value={couponFormData.coupon_id}
              onChange={handleCouponInputChange}
              className="py-3 rounded-md text-sm"
              labelStyle="text-sm font-medium"
              helperText="App ID under promotion code in stripe"
              onBlur={handleCouponInputBlur}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={handleAddCoupon}
              disabled={isLoadingAddCoupon || !couponFormData.coupon_code || !couponFormData.coupon_type || !couponFormData.coupon_name || !couponFormData.coupon_id}
              className="py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingAddCoupon ? (
                <>
                  <Spinner className="border-white w-4 h-4" />
                  <span>Adding...</span>
                </>
              ) : (
                "Add Coupon"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Coupons List */}
      <div className="px-3 sm:px-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Coupons</h3>

        {isLoadingCoupons ? (
          <div className="text-center py-8">
            <Spinner className="border-primary-base w-6 h-6 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No coupons found.</p>
          </div>
        ) : ( 
          <div className="grid gap-6 lg:grid-cols-2">
            {coupons.map((coupon: Coupon) => (
              <div
                key={coupon.code}
                className={`rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border ${
                  coupon.available
                    ? 'bg-white border-gray-100'
                    : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`text-lg font-semibold ${
                        coupon.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {coupon.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          coupon.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Coupon Code */}
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-mono font-medium border ${
                      coupon.available 
                        ? 'bg-gray-50 text-gray-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {coupon.code}
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      coupon.available ? 'text-primary-base' : 'text-gray-400'
                    }`}>
                      {coupon.percent_off}%
                    </div>
                    <div className={`text-xs uppercase tracking-wide ${
                      coupon.available ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      OFF
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className={coupon.available ? 'text-gray-600' : 'text-gray-500'}>Duration:</span>
                    <span className={`font-medium capitalize ${
                      coupon.available ? 'text-gray-900' : 'text-gray-500'
                    }`}>{coupon.duration}</span>
                  </div>

                  {coupon.duration_in_months && (
                    <div className="flex items-center justify-between text-sm">
                      <span className={coupon.available ? 'text-gray-600' : 'text-gray-500'}>Duration Months:</span>
                      <span className={`font-medium ${
                        coupon.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>{coupon.duration_in_months}</span>
                    </div>
                  )}

                  {coupon.max_redemptions && (
                    <div className="flex items-center justify-between text-sm">
                      <span className={coupon.available ? 'text-gray-600' : 'text-gray-500'}>Max Redemptions:</span>
                      <span className={`font-medium ${
                        coupon.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>{coupon.max_redemptions}</span>
                    </div>
                  )}

                  {coupon.expires_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className={coupon.available ? 'text-gray-600' : 'text-gray-500'}>Expires:</span>
                      <span className={`font-medium ${
                        coupon.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {new Date(coupon.expires_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Unavailable Message */}
                {!coupon.available && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-[10px] text-yellow-800 font-medium">
                      ⚠️ Coupon exists on Stripe but yet to be available. Please add it above.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
