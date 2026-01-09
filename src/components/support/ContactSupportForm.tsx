import { Button, Input, Spinner, SvgIcon } from "@/components/shared";

interface ContactSupportFormProps {
    formData: {
        subject: string;
        message: string;
    };
    isLoading: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export const ContactSupportForm = ({
    formData,
    isLoading,
    handleChange,
    handleSubmit
}: ContactSupportFormProps) => {
    return (
        <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
                Contact Support
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary-base/10 p-4 rounded-full mb-4"> 
                        <SvgIcon
                            name="support"
                            width={48}
                            height={48}
                            className="text-primary-base"
                            fill="currentColor"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                        How can we help?
                    </h3>
                    <p className="text-gray-500 text-center mt-2">
                        Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Subject"
                        type="text"
                        name="subject"
                        placeholder="Brief summary of the issue"
                        value={formData.subject}
                        onChange={handleChange}
                        icon="edit"
                        className="bg-white"
                    />

                    <div className="space-y-1">
                        <label className="flex items-center justify-between text-gray-700 font-medium">
                            Message
                        </label>
                        <div className="flex gap-3 border border-border rounded-2xl p-4 transition-colors focus-within:ring-1 focus-within:ring-primary-base bg-white">
                            <div className="mt-1">
                                <SvgIcon
                                    name="email-send"
                                    width={18}
                                    height={18}
                                    fill="#667185"
                                />
                            </div>
                            <textarea
                                name="message"
                                rows={6}
                                placeholder="Describe your issue in detail..."
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full outline-none bg-transparent resize-none text-base text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            disabled={isLoading}
                            className="bg-primary-base text-white hover:bg-primary-base/90 px-8 py-3 rounded-xl flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <SvgIcon
                                        name="send"
                                        width={18}
                                        height={18}
                                        fill="white"
                                    />
                                    <span>Send Message</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
