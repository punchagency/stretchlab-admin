import React, { useState } from "react";
import { Button, Input, Spinner } from "../shared";
import { forgotPassword } from "@/service/auth";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { type ApiError } from "@/types";

export const InviteForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    if (error) {
      setError("");
    }
    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
        try {
            setIsLoading(true);
            const response = await forgotPassword(formData.email);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.trim() });
    };

    return (
        <div className="flex items-center justify-center px-2 ">

            <div className="bg-white shadow-md rounded-lg p-4 md:p-8 w-full border border-gray-[#E4E7EC] max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Accept Invite</h2>
                <p className="text-gray-500 mb-6">
                    Enter your email address to accept the invite
                </p>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-4 relative flex flex-col gap-3">
                        <Input
                            label="Email"
                            icon="mail"
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="rounded-lg"
                        />

                            <Input
                                label="Password"
                                icon="lock"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-lg"

                            />  
                            <Input
                                label="Confirm Password"
                                icon="lock"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="rounded-lg"

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
                        className="w-full mt-4 bg-primary-base py-3 text-white flex items-center justify-center gap-2"
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
