import { useState } from "react";
import {
    Button as Button2,
    Input,
    Modal,
    SvgIcon,
} from "@/components/shared";
import {
    renderErrorToast,
    renderWarningToast,
} from "@/components/utils";
import type { ApiError } from "@/types";

interface InviteUserModalProps {
    show: boolean;
    onClose: () => void;
    onInvite: (email: string) => Promise<boolean>;   
}

export const InviteUserModal = ({ show, onClose, onInvite }: InviteUserModalProps) => {
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");
        if (!validateEmail(email)) {
            setFormError("Invalid email address");
            return;
        }

        try {
            setIsLoading(true);
            await onInvite(email);
            setEmail("");
            onClose();
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.response?.status === 409) {
                renderWarningToast(apiError.response.data.message);
            } else {
                renderErrorToast(apiError.response?.data?.message || "An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 py-4 px-2 md:px-10"
            >
                <h1 className="text-lg md:text-2xl font-semibold text-center mb-4">
                    Invite User
                </h1>
                <Input
                    label="Email Address"
                    type="email"
                    icon="mail"
                    placeholder="user@gmail.com"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                {formError && (
                    <div className="bg-red-100 rounded-lg px-2 py-3">
                        <p className="text-red-500 font-medium text-sm text-center">
                            {formError}
                        </p>
                    </div>
                )}
                <Button2
                    disabled={isLoading}
                    className="bg-primary-base mt-2 py-3 w-fit mx-auto flex items-center gap-2 text-white"
                >
                    <SvgIcon name="email-send" fill="#fff" />
                    {isLoading ? "Sending..." : "Send Invite"}
                </Button2>
            </form>
        </Modal>
    );
};
