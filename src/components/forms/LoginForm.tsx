import React, { useState } from "react";
import { Input, Button, Spinner } from "../shared";
import { login } from "@/service/auth";
import type { ApiError } from "@/types";
import { setUserCookie } from "@/utils";
import { Link, useNavigate } from "react-router";
import {
  renderSuccessToast,
  renderErrorToast,
  renderWarningToast,
} from "../utils";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) {
      setError("");
    }
    if (formData.email === "" || formData.password === "") {
      setError("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(formData.email, formData.password);
      if (response.status === 200) {
        setUserCookie(response.data.token);
        if (response.data.user.is_verified) {
          renderSuccessToast(response.data.message);
          navigate("/dashboard");
        } else {
          renderWarningToast(response.data.message);
          navigate("/verification");
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        icon="mail"
        type="email"
        name="email"
        placeholder="Enter email address"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        icon="lock"
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />
      <Link to="/forgot-password" className="text-primary-base text-sm ml-auto">
        Forgot password?
      </Link>
      {error && (
        <div className="bg-red-100 rounded-lg px-2 py-3">
          <p className="text-red-500 font-medium text-sm text-center">
            {error}
          </p>
        </div>
      )}

      <Button
        disabled={isLoading}
        className="bg-primary-base phone:mt-2 tablet:mt-6 laptop:mt-6 py-4 text-white flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Logging in...</span>
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};
