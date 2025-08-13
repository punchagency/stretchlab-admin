import React, { useState, useEffect } from "react";
import { Button, Input, Spinner } from "../shared";
import { addPassword } from "@/service/user";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { type ApiError } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

export const InviteForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("email");
        if (token) {
            try {
                const decoded: { email?: string } = jwtDecode(token);
                if (decoded.email) {
                    setFormData((prev) => ({
                        ...prev,
                        email: decoded.email ?? ""
                    }));
                }
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (error) {
            setError("");
        }
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.full_name) {
            setError("Please fill in all fields");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            const response = await addPassword(formData.email, formData.password, formData.full_name);
            if (response.status === 200) {
                renderSuccessToast(response.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
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
        setFormData({ ...formData, [name]: name === "email" ? value.trim() : value });

    };

    return (
        <div className="flex items-center justify-center px-2">
            <div className="bg-white shadow-md rounded-lg p-4 md:p-8 w-full border border-gray-[#E4E7EC] max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Accept Invite</h2>
                <p className="text-gray-500 mb-6">
                    Enter your details to accept the invite
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
                            disabled={true}
                        />
                        <Input
                            label="Name"
                            icon="users"
                            type="text"
                            name="full_name"
                            placeholder="Enter full name"
                            value={formData.full_name}
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
