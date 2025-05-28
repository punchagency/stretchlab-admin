import React, { useState } from "react";
import { Button, Input, Spinner } from "../shared";
import { useNavigate, useParams } from "react-router";
import { resetPassword } from "../../service/auth";
import { type ApiError } from "@/types";
import { renderSuccessToast, renderErrorToast } from "../utils";
export const ResetForm = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  console.log(token, "token");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid link");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 1000);
      return;
    }
    if (formData.password === "" || formData.confirmPassword === "") {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(formData.password, token as string);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        renderErrorToast(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 w-full border border-gray-[#E4E7EC] max-w-[33rem]">
        <div className="flex flex-col mb-6">
          {/* <img
            src="/verify-illustration.svg"
            alt="Verify"
            className="w-24 mb-4"
          /> */}
        </div>
        <h2 className="text-3xl font-semibold mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-6">
          Enter your new password to reset your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-4 relative">
            <Input
              label="Enter Password"
              icon="lock"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
            />
            <Input
              label="Confirm Password"
              icon="lock"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Enter password"
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
            disabled={isLoading}
            className="w-full bg-primary-base py-4 mt-4 flex items-center justify-center gap-2 text-white"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Resetting password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
