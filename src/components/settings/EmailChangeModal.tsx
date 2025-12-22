import React, { useState } from "react";
import { Button, Spinner, Modal, OTPInputComponent } from "@/components/shared";
import { changeEmailVerify } from "@/service/settings";
import type { ApiError } from "@/types";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { useNavigate } from "react-router";
import { deleteUserCookie } from "@/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newEmail: string;
}

export const EmailChangeModal = ({ isOpen, onClose, newEmail }: EmailChangeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Verification code is required");
      return;
    }
    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await changeEmailVerify(newEmail, code);

      if (response.status === 200) {
        renderSuccessToast("Email changed successfully! Please login with your new email.");
        handleClose();
        deleteUserCookie();
        navigate("/login");
      } else {
        renderErrorToast(response.data.message || "Email verification failed");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data.message || "Email verification failed";
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

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (error) {
      setError("");
    }
  };

  const modalContent = (
    <div className="p-0 sm:p-5 text-center">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Verify Email Change</h2>
        <p className="text-gray-500 text-sm">
          A 6-digit verification code has been sent to
        </p>
        <p className="text-primary-base font-bold text-sm mt-1">
          {newEmail}
        </p>
        
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <OTPInputComponent
            value={code}
            onChange={handleCodeChange}
            error={error}
            label="Enter Code"
            size={isMobile ? "md" : "lg"}
          />
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Code expires in 5 minutes 
          </p>
        </div>

        <div className="flex gap-3 justify-end sm:flex-row flex-col">
          <Button
            type="button"
            onClick={handleClose}
            className="px-6 sm:py-2 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || !code || code.length !== 6}
            className="px-6 sm:py-2 py-3 bg-primary-base hover:bg-primary-base/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="border-white w-4 h-4" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify & Change Email"
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