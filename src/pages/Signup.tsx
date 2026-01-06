import logo from "@/assets/images/stretchnote.png";
import { SignupForm } from "@/components/forms";
import { PricingSection } from "@/components/shared";
import { pricingPlans } from "@/lib/pricingPlans";
import { Link } from "react-router";
export const Signup = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-6 sm:px-10">
      <div className="flex flex-col xl:flex-row gap-12">
        <div className="sm:w-full md:w-full xl:w-1/2 flex flex-col gap-4 justify-center">
          <img src={logo} alt="logo" className="w-50 mx-auto" />
          <h1 className="sm:text-2xl md:text-3xl xl:text-4xl font-semibold tracking-custom text-center text-dark-1">
            Create an account
          </h1>
          {/* <p className="sm:text-sm md:text-base xl:text-lg leading-5 tracking-custom2 -mt-2 text-grey-5 text-center">
            Create an account to manage teams and tools with AI-powered
            capabilities to enhance every stretch.
          </p> */}
          <SignupForm />
          <p className="text-grey-5 text-center">
            Already have an account?{" "}
            <Link className="text-primary-base" to="/login">
              Log in
            </Link>
          </p>
        </div>
        <PricingSection plans={pricingPlans} />
      </div>
    </div>
  );
};
