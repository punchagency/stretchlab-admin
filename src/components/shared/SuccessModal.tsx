import { SvgIcon } from "./SvgIcon";

export const SuccessModal = ({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center px-4 justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
        role="button"
        aria-label="Close modal"
      />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <div className="flex items-center bg-[#F4FAFB] rounded-full p-2 w-fit mx-auto justify-center mb-4">
          <SvgIcon name="check-circle" width={24} height={24} fill="#368591" />
        </div>
        <h2 className="text-base text-center font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-center text-grey-5 text-sm">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-base text-white rounded-md hover:bg-opacity-80"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
