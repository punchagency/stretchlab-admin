import React, { useState } from "react";
import { Button, Input, Spinner } from "../shared";
import { verify2FALogin, resend2FAVerificationCode } from "@/service/auth";
import type { ApiError } from "@/types";
import { renderSuccessToast, renderErrorToast } from "../utils";
import { useNavigate } from "react-router";
import { setUserCookie } from "@/utils";
import logo from "@/assets/images/stretchlab.png";

interface TwoFactorLoginFormProps {
  userEmail: string;
}

export const TwoFactorLoginForm: React.FC<TwoFactorLoginFormProps> = ({
  userEmail
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      setError("");
    }

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
      const response = await verify2FALogin(code, userEmail);

      if (response.status === 200) {
        setUserCookie(response.data.token);
        renderSuccessToast(response.data.message || "2FA verification successful");
        navigate("/dashboard");
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response?.data.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      if (error) {
        setError("");
      }
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      setError("");

      const response = await resend2FAVerificationCode(userEmail);

      if (response.status === 200) {
        renderSuccessToast(response.data.message || "New verification code sent to your email");
        setCode("");
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

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br from-primary-secondary/20 to-primary-tertiary/30">
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="mb-8">
          <img src={logo} alt="StretchLab" className="w-40 h-auto mx-auto" />
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-1 mb-3">
              Two-Factor Authentication
            </h1>
            <p className="text-grey-5 leading-3 text-base">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-primary-base font-semibold text-base mt-1">
              {userEmail}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                label="Verification Code"
                name="code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-mono font-semibold py-4"
              />

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || isLoading}
                  className="text-sm text-primary-base hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner className="border-primary-base w-4 h-4" />
                      <span>Sending new code...</span>
                    </div>
                  ) : (
                    "Didn't receive the code? Resend"
                  )}
                </button>
                <p className="text-xs text-grey-4 mt-1">
                  Code expires in 10 minutes
                </p>
              </div>
            </div>



            <Button
              disabled={isLoading || code.length !== 6}
              type="submit"
              className="w-full bg-primary-base hover:bg-primary-base/90 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="border-white" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              className="text-grey-5 hover:text-primary-base transition-colors font-medium text-sm"
              onClick={() => navigate("/login")}
            >
              ← Back to Login
            </button>
          </div>
        </div>

        <div className="mt-6 text-center max-w-md">
          <p className="text-xs text-grey-4 leading-relaxed">
            This extra step helps keep your account secure. Never share your verification code with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}; 