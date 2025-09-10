import { useState, useRef, useEffect } from "react";
import { Modal } from "./Modal";
import { Button as Button2, SvgIcon } from "./index";
import { downloadCSVTemplate, parseCSVFile } from "@/utils/csv";
import { bulkInviteFlexologists } from "@/service/notetaking";
import { renderErrorToast, renderSuccessToast } from "@/components/utils";
import type { ApiError } from "@/types";

interface BulkInviteModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isResendMode?: boolean;
  selectedEmails?: string[];
}

export const BulkInviteModal = ({
  show,
  onClose,
  onSuccess,
  isResendMode = false,
  selectedEmails = []
}: BulkInviteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedEmails, setUploadedEmails] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize emails for resend mode
  useEffect(() => {
    if (isResendMode && selectedEmails.length > 0) {
      setUploadedEmails(selectedEmails);
    }
  }, [isResendMode, selectedEmails]);

  const handleDownloadTemplate = () => {
    downloadCSVTemplate();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsLoading(true);

    try {
      const emails = await parseCSVFile(file);
      setUploadedEmails(emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkInvite = async () => {
    if (uploadedEmails.length === 0) {
      setError(isResendMode ? "No users selected for resend" : "Please upload a CSV file with emails first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await bulkInviteFlexologists(uploadedEmails, isResendMode);
      const successMessage = isResendMode
        ? response.data.message || "Resend invites sent successfully"
        : response.data.message || "Bulk invites sent successfully";
      renderSuccessToast(successMessage);
      onSuccess();
      onClose();
      setUploadedEmails([]);

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = isResendMode
        ? apiError.response?.data?.message || "Failed to resend invites"
        : apiError.response?.data?.message || "Failed to send bulk invites";
      renderErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUploadedEmails([]);
    setError("");
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose} size="lg">
      <div className="flex flex-col gap-6 py-6 px-4 md:px-8">
        <h1 className="text-xl md:text-2xl font-semibold text-center">
          {isResendMode ? "Resend Invites" : "Bulk Invite Flexologists"}
        </h1>

        <div className="space-y-4">
          {!isResendMode && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Download the CSV template below</li>
                  <li>Fill in the email addresses in the template</li>
                  <li>Upload the completed CSV file</li>
                  <li>Click "Send Bulk Invites" to invite all flexologists</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button2
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <SvgIcon name="send" fill="#fff" />
                  Download CSV Template
                </Button2>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Upload CSV File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-base file:text-white hover:file:bg-primary-base/80"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {uploadedEmails.length > 0 && (
            <div className={`border rounded-lg p-4 bg-green-50 border-green-200`}>
              <h4 className={`font-semibold mb-2  text-green-800`}>
                {isResendMode ? 'Users to Resend Invites' : 'Emails Ready to Invite'} ({uploadedEmails.length})
              </h4>
              {isResendMode && <p className="text-sm text-green-800">
                You are about to resend invites to the selected users. This will send new invitation emails to the following users:
              </p>}
              <div className="max-h-32 overflow-y-auto">
                {uploadedEmails.map((email, index) => (
                  <div key={index} className={`text-sm py-1 text-green-700 font-bold`}>
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button2
            onClick={handleClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </Button2>
          <Button2
            onClick={handleBulkInvite}
            disabled={isLoading || uploadedEmails.length === 0}
            className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 bg-primary-base hover:bg-primary-base/80
            `}
          >
            <SvgIcon name="email-send" fill="#fff" />
            {isLoading
              ? (isResendMode ? "Resending..." : "Sending...")
              : (isResendMode ? "Resend Invites" : "Send Bulk Invites")
            }
          </Button2>
        </div>
      </div>
    </Modal>
  );
};
