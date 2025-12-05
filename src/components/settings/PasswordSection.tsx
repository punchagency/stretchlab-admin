import { Button, Input, Spinner } from "@/components/shared";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import { TwoFactorModal } from "./TwoFactorModal";

type PasswordSectionProps = {
  settingsData: ReturnType<typeof useSettings>; 
};

export const PasswordSection = ({ settingsData }: PasswordSectionProps) => {
  const {
    user,
    passwordTab, 
    passwordData,
    twoFactorSettings,
    twoFactorModal,
    isLoadingTwoFactor,
    isLoadingPassword,
    setPasswordTab,
    handlePasswordInputChange,
    handleTwoFactorToggle,
    handleUpdatePassword,
    handleTwoFactorModalClose,
    handleTwoFactorSuccess, 
  } = settingsData;

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-3 sm:pb-4 px-3 sm:px-6">
        <h2 className="text-base text-gray-900 mb-1 font-semibold">
          Password & Security
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set a passwords to protect your account.
        </p>
      </div>
      <div className="">
        <div className="flex space-x-3 sm:space-x-5 border-b border-border px-3 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setPasswordTab("password")}
            className={`pb-2 sm:pb-3 text-[13px] sm:text-sm border-b-2 transition-colors whitespace-nowrap ${passwordTab === "password"
                ? "text-primary-base border-primary-base"
                : "text-muted-foreground border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Password
          </button>
          <button
            onClick={() => setPasswordTab("2fa")}
            className={`pb-2 sm:pb-3 text-[13px] sm:text-sm border-b-2 transition-colors whitespace-nowrap ${passwordTab === "2fa"
                ? "text-primary-base border-primary-base"
                : "text-muted-foreground border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            2 Factor authentication
          </button>
        </div>
      </div>

      <div className="px-2 sm:px-6">
        {passwordTab === "password" ? (
          <div className="space-y-5 mt-6">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              className="py-3 rounded-md text-sm"
              labelStyle="text-sm font-medium"
            />

            <div className="space-y-1">  
              <Input
                label="New password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="py-3 rounded-md text-sm"
                labelStyle="text-sm font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div> 

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className="py-3 rounded-md text-sm"
              labelStyle="text-sm font-medium"
            />

            <div className="pt-4">
              <Button
                onClick={handleUpdatePassword}
                disabled={isLoadingPassword}
                className="py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {isLoadingPassword ? (
                  <>
                    <Spinner className="border-white w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="space-y-2 sm:space-y-3 flex flex-col">
              <span className="text-sm font-medium text-gray-900">Email</span>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 lg:gap-10">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Two factor authentication {twoFactorSettings.emailEnabled ? "is enabled" : "is disabled"} on your email{" "}
                    <span className="font-semibold break-all">
                      '{user?.email || "No email available"}'
                    </span>
                  </p>

                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isLoadingTwoFactor && (
                    <Spinner className="border-primary-base w-4 h-4" />
                  )}
                  <Switch
                    checked={twoFactorSettings.emailEnabled}
                    onCheckedChange={() => handleTwoFactorToggle("emailEnabled")}
                    className="data-[state=checked]:bg-primary-base"
                    disabled={isLoadingTwoFactor}
                  />
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
      <TwoFactorModal
        isOpen={twoFactorModal.isOpen}
        onClose={handleTwoFactorModalClose}
        mode={twoFactorModal.mode || "enable"}
        onSuccess={handleTwoFactorSuccess}
      />
    </div>
  );
}; 