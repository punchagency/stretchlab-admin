import React, { useState } from "react";
import { Input, Button, Spinner } from "../shared";
import { login } from "@/service/auth";
import type { ApiError, LoginResponse } from "@/types";
import { setTempUserCookie, setUserCookie, deleteUserCookie } from "@/utils";
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
      if (response.status === 200) {
        const loginData = response.data as LoginResponse;
        if (loginData.requires_2fa) {
          navigate(`/2fa-login?email=${encodeURIComponent(formData.email)}`);
          return;
        }
        console.log({loginData})
        if (loginData.token) {
          if (
            loginData.user.is_verified &&
            loginData.user.is_clubready_verified
          ) {
            console.log("is_verified and is_clubready_verified");
            setUserCookie(loginData.token);
            renderSuccessToast(loginData.message);
            navigate("/dashboard");
          } else if (
            loginData.user.is_verified &&
            !loginData.user.is_clubready_verified
          ) {
            console.log("is_verified and !is_clubready_verified");
            setTempUserCookie(loginData.token);
            navigate("/robot-setup");
          } else {
            setTempUserCookie(loginData.token);
            navigate("/verification");
          }
        } else {
          renderErrorToast("Login failed: No authentication token received");
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.log({ apiError: apiError.response.data });
      if (apiError.response.status === 403) {
        setUserCookie(apiError.response.data.token as string);
        renderSuccessToast(apiError.response.data.message);
        window.location.href = redirectUrl;
        // window.location.reload();
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
