import { Modal, Input } from "../shared";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { createPaymentMethod, initialize } from "@/service/payment";
import { renderSuccessToast, renderWarningToast } from "../utils";
import type { ApiError } from "@/types/response";
import { Loader2 } from "lucide-react";
import type { BillingInfo } from "@/types";
import logo from "@/assets/images/stretchlab.png";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({
  onClose,
  price,
  robot,
  update,
  setUpdate,
  setProceed,
}: {
  onClose: () => void;
  price: number;
  robot: boolean;
  update: boolean;
  setUpdate: (update: boolean) => void;
  setProceed: (proceed: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [coupon, setCoupon] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!stripe || !elements) return;
    try {
      setLoading(true);
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message as string);
        return;
      }
      if (setupIntent) {
        if (
          setupIntent.status === "requires_action" &&
          setupIntent.client_secret
        ) {
          const { error: confirmError, setupIntent: confirmedSetupIntent } =
            await stripe.confirmSetup({
              elements,
              clientSecret: setupIntent.client_secret,
              redirect: "if_required",
            });

          if (confirmError) {
            setErrorMessage(confirmError.message as string);
            setLoading(false);
            return;
          }

          if (confirmedSetupIntent.status !== "succeeded") {
            setErrorMessage("Payment method setup failed. Please try again.");
            setLoading(false);
            return;
          }

          const response = await createPaymentMethod(
            confirmedSetupIntent.payment_method as string,
            coupon
          );
          if (response.status === 200) {
            renderSuccessToast(
              `Payment method ${update ? "updated" : "added"} successfully`
            );
            setUpdate(false);
            setProceed(true);
            onClose();
          } else {
            renderWarningToast(response.data.message);
          }
        } else if (setupIntent.status === "succeeded") {
          const response = await createPaymentMethod(
            setupIntent.payment_method as string,
            coupon
          );
          if (response.status === 200) {
            renderSuccessToast(
              `Payment method ${update ? "updated" : "added"} successfully`
            );
            setUpdate(false);
            setProceed(true);
            onClose();
          } else {
            renderWarningToast(response.data.message);
          }
        } else {
          setErrorMessage("Unexpected setup intent status.");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center mb-4">
        <img src={logo} alt="StretchLab" className="w-40 h-auto mx-auto" />
      </div>
      <p className="text-sm text-gray-500 mb-4 font-medium text-center">
        {`This will charge you $${price} per ${robot ? "location" : "flexologist"
          } per month.`}
      </p>
      <PaymentElement onReady={() => setPaymentElementReady(true)} />
      <div className="mt-4">
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-500 mb-2">
          Coupon Code
        </label>
        <input
          id="coupon"
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent"
        />
      </div>
      {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      <div className="flex items-center mt-4 gap-2">
        {update && (
          <button
            type="button"
            onClick={() => setUpdate(false)}
            className="w-full bg-gray-100 font-semibold flex items-center justify-center  cursor-pointer text-gray-800 px-4 py-3 rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="w-full bg-primary-base font-semibold flex items-center justify-center  cursor-pointer text-white px-4 py-3 rounded-md disabled:opacity-30"
          disabled={!stripe || !elements || loading || !paymentElementReady}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              {update ? "Updating..." : "Submitting..."}
            </>
          ) : update ? (
            "Update Payment Method"
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export const PaymentCollection = ({
  show,
  onClose,
  billingInfo,
  robot,
  update,
  setUpdate,
  setProceed,
}: {
  show: boolean;
  onClose: () => void;
  robot: boolean;
  billingInfo: BillingInfo | null;
  update: boolean;
  setProceed: (proceed: boolean) => void;
  setUpdate: (update: boolean) => void;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const initializeSetup = async () => {
      try {
        const response = await initialize(robot ? "robot" : "flexologist");
        if (response.status === 200) {
          setClientSecret(response.data.clientSecret);
          setPrice(response.data.price);
        } else {
          renderWarningToast(response.data.message);
        }
      } catch (error) {
        const apiError = error as ApiError;
        renderWarningToast(apiError.response.data.message);
      }
    };
    initializeSetup();
  }, []);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
    },
  };

  return (
    <Modal
      show={show}
      onClose={() => {
        setUpdate(false);
        onClose();
      }}
    >
      {billingInfo && !update ? (
        <div className="p-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                {billingInfo.brand === "visa" ? (
                  <span className="text-blue-600 font-bold">VISA</span>
                ) : (
                  <span className="text-gray-600 font-bold">
                    {billingInfo.brand.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">•••• {billingInfo.last4}</p>
                <p className="text-sm text-gray-500">
                  Expires {billingInfo.exp_month}/{billingInfo.exp_year}
                </p>
              </div>
            </div>
            {billingInfo.name && (
              <p className="text-sm text-gray-600">Name: {billingInfo.name}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setUpdate(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Update Payment Method
            </button>
            <button
              onClick={() => {
                renderSuccessToast("Continuing with default payment method");
                setProceed(true);
                onClose();
              }}
              className="flex-1 bg-primary-base hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Use Payment Method
            </button>
          </div>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm
            onClose={onClose}
            price={price ?? 0}
            robot={robot}
            update={update}
            setUpdate={setUpdate}
            setProceed={setProceed}
          />
        </Elements>
      ) : (
        <div className="grid place-items-center h-[15rem]">
          <div className="flex items-center  gap-2">
            <Loader2 className="animate-spin" />
            <p>Initializing...</p>
          </div>
        </div>
      )}
    </Modal>
  );
};
