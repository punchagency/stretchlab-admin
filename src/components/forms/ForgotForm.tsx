import React, { useState } from "react";
import { Button, Input, Spinner, SvgIcon } from "../shared";
import { Link } from "react-router";
import { forgotPassword } from "@/service/auth";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { type ApiError } from "@/types";
export const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 md:px-0 min-h-screen">
      <div className="absolute top-4 left-4">
        <Link
          to="/login"
          className="bg-transparent text-dark-1 flex items-center gap-2"
        >
          <SvgIcon name="angle-left" />
          Back
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 md:p-8 w-full border border-gray-[#E4E7EC] max-w-md text-center">
        <div className="flex flex-col items-center mb-6">
          {/* <img
            src="/verify-illustration.svg"
            alt="Verify"
            className="w-24 mb-4"
          /> */}
        </div>
        <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
        <p className="text-gray-500 mb-6">
          Enter your email address to reset your password
        </p>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4 relative">
            <Input
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          {error && (
            <div className="bg-red-100 rounded-lg px-2 py-3">
              <p className="text-red-500 font-medium text-sm text-center">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-3 bg-primary-base py-3 text-white flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
