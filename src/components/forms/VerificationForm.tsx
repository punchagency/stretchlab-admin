import React, { useState } from "react";
import { Button, Input, Spinner } from "../shared";
import { verify, resendCode } from "@/service/auth";
import type { ApiError } from "@/types";
import { renderSuccessToast, renderErrorToast } from "../utils";
import { useNavigate } from "react-router";

export const VerificationForm = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

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
      const response = await verify(code);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        navigate("/dashboard");
      } else {
        renderErrorToast(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const response = await resendCode();
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
      } else {
        renderErrorToast(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response?.data.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* <div className="absolute top-4 left-4">
        <Link
          to="/login"
          className="bg-transparent text-dark-1 flex items-center gap-2"
        >
          <SvgIcon name="angle-left" />
          Back
        </Link>
      </div> */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full border border-gray-[#E4E7EC] max-w-md text-center">
        <div className="flex flex-col items-center mb-6">
          {/* <img
            src="/verify-illustration.svg"
            alt="Verify"
            className="w-24 mb-4"
          /> */}
        </div>
        <h2 className="text-3xl font-bold mb-2">Verify Code</h2>
        <p className="text-gray-500 mb-6">
          An authentication code has been sent to your email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <Input
              label="Enter code"
              name="code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="mb-6 text-sm">
            Didn't receive code?{" "}
            <button
              type="button"
              className="text-primary-base hover:bg-opacity-60 font-medium cursor-pointer hover:underline"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary-base py-3 flex items-center justify-center gap-2 text-white"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
