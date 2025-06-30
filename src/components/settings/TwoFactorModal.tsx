import React, { useState } from "react";
import { Button, Spinner, Modal, OTPInputComponent } from "@/components/shared";
import { verifyTwoFactorSetup, verifyTwoFactorDisable, resendTwoFactorCode } from "@/service/settings";
import type { ApiError } from "@/types";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "enable" | "disable" | "resend";
  onSuccess: () => void;
}

export const TwoFactorModal = ({ isOpen, onClose, mode, onSuccess }: TwoFactorModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Code is required");
      return;
    }
    if (code.length !== 6) {
      setError("Code must be 6 digits");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = mode === "disable" 
        ? await verifyTwoFactorDisable(code)
        : await verifyTwoFactorSetup(code); 

      if (response.status === 200) {
        const successMessage = mode === "disable" 
          ? "Two-factor authentication disabled successfully"
          : "Two-factor authentication enabled successfully";
        renderSuccessToast(response.data.message || successMessage);
        onSuccess();
        handleClose();
      } else {
        renderErrorToast(response.data.message || "Verification failed");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data.message || "Verification failed";
      setError(errorMessage);
      renderErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      setError("");
      
      const response = await resendTwoFactorCode();
      
      if (response.status === 200) {
        renderSuccessToast("New verification code sent successfully");
        setCode(""); // Clear the current code
      } else {
        renderErrorToast(response.data.message || "Failed to resend verification code");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data.message || "Failed to resend verification code";
      setError(errorMessage);
      renderErrorToast(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const modalContent = (
    <div className="p-6 text-center">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          {mode === "disable" ? "Disable" : "Verify"} Two-Factor Authentication
        </h2>
        <p className="text-gray-500 text-sm">
          {mode === "disable" 
            ? "A 6-digit verification code has been sent to your email. Please enter it below to disable two-factor authentication."
            : mode === "resend"
            ? "A new 6-digit verification code has been sent to your email. Please enter it below to complete the setup."
            : "A 6-digit verification code has been sent to your email. Please enter it below to complete the setup."
          }
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <OTPInputComponent
            value={code}
            onChange={(value) => {
              setCode(value);
              setError("");
            }}
            error={error}
            label="Verification Code"
            size="lg"
          />
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || isLoading}
              className="text-sm text-primary-base hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-1">
                  <Spinner className="border-primary-base w-3 h-3" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Didn't receive the code? Resend"
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Code expires in 10 minutes
            </p>
          </div>
        </div>


        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || !code || code.length !== 6}
            className={`px-6 py-2 text-white transition-colors ${
              mode === "disable" 
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary-base hover:bg-primary-base/90" 
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              mode === "disable" ? "Disable 2FA" : "Verify 2FA"
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <Modal show={isOpen} onClose={handleClose} size="sm">
      {modalContent}
    </Modal>
  );
}; 