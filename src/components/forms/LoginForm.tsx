import React, { useState } from "react";
import { Input, Button, Spinner } from "../shared";
import { login } from "@/service/auth";
import type { ApiError, LoginResponse } from "@/types";
import { setTempUserCookie, setUserCookie, deleteUserCookie, setRefreshToken } from "@/utils";
import { Link, useNavigate } from "react-router";
import { renderSuccessToast, renderErrorToast } from "../utils";

const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

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
      deleteUserCookie();
      const response = await login(formData.email, formData.password);
      if (response.status === 202) {
        navigate(`/2fa-login?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (response.status === 200) {
        const loginData = response.data as LoginResponse;
        if (loginData.access_token) {
          if (
            loginData.user.is_verified &&
            loginData.user.is_clubready_verified
          ) {
            setUserCookie(loginData.access_token);
            if (loginData.refresh_token) {
              setRefreshToken(loginData.refresh_token);
            }
            renderSuccessToast(loginData.message);
            navigate("/dashboard");
          } else if (
            loginData.user.is_verified &&
            !loginData.user.is_clubready_verified
          ) {
            setTempUserCookie(loginData.access_token);
            if (loginData.refresh_token) {
              setRefreshToken(loginData.refresh_token);
            }
            navigate("/robot-setup");
          } else {
            setUserCookie(loginData.access_token);
            if (loginData.refresh_token) {
              setRefreshToken(loginData.refresh_token);
            }
            navigate("/verification");
          }
        } else {
          renderErrorToast("Login failed: Please try again");
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response.status === 403) {
        setUserCookie(apiError.response.data.access_token as string);
        if (apiError.response.data.refresh_token) {
          setRefreshToken(apiError.response.data.refresh_token);
        }
        window.location.href = redirectUrl;
        return;
      }
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
