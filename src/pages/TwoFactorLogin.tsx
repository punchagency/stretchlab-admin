import { TwoFactorLoginForm } from "@/components/forms/TwoFactorLoginForm";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";

export const TwoFactorLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);
  if (!email) {
    return null;
  }
  return <TwoFactorLoginForm userEmail={email} />;
};   