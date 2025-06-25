import { Button, Input, Spinner } from "@/components/shared";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import { TwoFactorModal } from "./TwoFactorModal";

export const PasswordSection = () => {
  const {
    user,
    passwordTab,
    passwordData,
    twoFactorSettings,
    twoFactorModal,
    isLoadingTwoFactor,
    setPasswordTab,
    handlePasswordInputChange,
    handleTwoFactorToggle,
    handleUpdatePassword,
    handleTwoFactorModalClose,
    handleTwoFactorSuccess,
  } = useSettings();

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-4 px-6">
        <h2 className="text-base text-gray-900 mb-1 font-semibold">
          Password & Security
        </h2>
        <p className="text-sm text-muted-foreground">
          Set a passwords to protect your account.
        </p>
      </div>
      <div className="">
        <div className="flex space-x-5 border-b border-border px-6">
          <button
            onClick={() => setPasswordTab("password")}
            className={`pb-3 text-sm border-b-2 transition-colors ${passwordTab === "password"
                ? "text-primary-base border-primary-base"
                : "text-muted-foreground border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Password
          </button>
          <button
            onClick={() => setPasswordTab("2fa")}
            className={`pb-3 text-sm border-b-2 transition-colors ${passwordTab === "2fa"
                ? "text-primary-base border-primary-base"
                : "text-muted-foreground border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            2 Factor authentication
          </button>
        </div>
      </div>

      <div className="px-6">
        {passwordTab === "password" ? (
          <div className="space-y-5 mt-6">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              className="py-3 rounded-md"
              labelStyle="text-sm font-medium"
            />

            <Input
              label="New password"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className="py-3 rounded-md"
              labelStyle="text-sm font-medium"
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className="py-3 rounded-md"
              labelStyle="text-sm font-medium"
            />

            <div className="pt-4">
              <Button
                onClick={handleUpdatePassword}
                className="py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors"
              >
                Update password
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            <div className="space-y-3 flex flex-col">
              <span className="text-sm font-medium text-gray-900">Email</span>

              <div className="flex justify-between space-x-10">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Two factor authentication {twoFactorSettings.emailEnabled ? "is enabled" : "is disabled"} on your email{" "}
                    <span className="font-semibold">
                      '{user?.email || "No email available"}'
                    </span>
                  </p>

                </div>
                <div className="flex items-center gap-2">
                  {isLoadingTwoFactor && (
                    <Spinner className="border-primary-base" />
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