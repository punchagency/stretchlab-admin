import React, { useState } from "react";
import { Input, Button, Spinner } from "../shared";
// import { Checkbox } from "@/components/ui/checkbox";
import { checkUsername, signup, registerBookingBridge } from "@/service/auth";
import type { ApiError } from "@/types";
import { setTempUserCookie, setRefreshToken } from "@/utils";
import { useNavigate } from "react-router";
import { renderErrorToast, renderSuccessToast } from "../utils";
export const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [isBookingBridgeOnly] = useState(false);

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setValidUsername(false);
      setUsernameSuccess("");
      setUsernameError("");
      if (value.length > 15) {
        setError("Username must be less than 15 characters");
        return;
      }
      const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value.trim() });
    }
  };
  const checkNewUserName = async (username: string) => {
    setCheckingUsername(true);
    try {
      const response = await checkUsername(username.toLowerCase());
      if (response.status === 200) {
        setValidUsername(true);
        setUsernameSuccess(response.data.message.toLowerCase());
      } else {
        setUsernameError(response.data.message.toLowerCase());
      }
    } catch (error) {
      const apiError = error as ApiError;
      setUsernameError(apiError.response.data.message);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const username = e.target.value;
    if (username.length > 0) {
      setValidUsername(false);
      setError("");
      setUsernameSuccess("");
      setUsernameError("");
      checkNewUserName(username);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) {
      setError("");
    }
    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.username === "" ||
      formData.confirmPassword === ""
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include letters, numbers, and at least one special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      let response;
      if (isBookingBridgeOnly) {
        response = await registerBookingBridge(
          formData.email,
          formData.password,
          formData.username
        );
      } else {
        response = await signup(
          formData.email,
          formData.password,
          formData.username
        );
      }
      if (response.status === 201) {
        setTempUserCookie(response.data.access_token);
        if (response.data.refresh_token) {
          setRefreshToken(response.data.refresh_token);
        }
        renderSuccessToast("Account created successfully");
        navigate("/verification");
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
      <div className="flex flex-col gap-2">
        <Input
          label="Username"
          icon="mail"
          type="text"
          name="username"
          placeholder="Enter username"
          maxLength={15}
          onBlur={handleBlur}
          value={formData.username}
          onChange={handleChange}
          error={usernameError}
          checking={checkingUsername}
          success={usernameSuccess}
        />


        <p className="text-grey-5 text-sm">
          This will be your sub-domain name e.g.{" "}
          <span>
            <span className="font-semibold">username</span>.stretchnote.com
          </span>
        </p>
      </div>

      <Input
        label="Password"
        icon="lock"
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />
      <Input
        label="Confirm Password"
        icon="lock"
        type="password"
        name="confirmPassword"
        placeholder="Enter password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      {error && (
        <div className="bg-red-100 rounded-lg px-2 py-3">
          <p className="text-red-500 font-medium text-sm text-center">
            {error}
          </p>
        </div>
      )}
      {/* <div className="flex items-center gap-2">
        <Checkbox
          id="bookingBridgeOnly"
          checked={isBookingBridgeOnly}
          onCheckedChange={(checked) => setIsBookingBridgeOnly(checked === true)}
        />
        <label htmlFor="bookingBridgeOnly" className="text-sm text-gray-700">
          Sign up for Booking Bridge only
        </label>
      </div> */}
      <Button
        disabled={isLoading || !validUsername}
        className="bg-primary-base  phone:mt-2 tablet:mt-6 laptop:mt-6 py-4 text-white flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Creating account...</span>
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};
