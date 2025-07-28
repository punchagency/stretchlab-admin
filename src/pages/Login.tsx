import logo from "@/assets/images/stretchlab.png";
import model from "@/assets/images/model.png";
import { LoginForm } from "@/components/forms";
import { Link } from "react-router";
export const Login = () => {
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex flex-col xl:flex-row w-[90%] md:w-[60%] xl:w-[80%] xl:min-w-[1200px] xl:max-w-[1200px] xl:min-h-[560px] xl:max-h-[560px] mx-auto gap-12 sm:h-[80%] md:h-[90%] xl:h-[90%]">
        <div className="sm:w-full md:w-full xl:w-1/2 flex flex-col gap-4 justify-center">
          <img src={logo} alt="logo" className="w-36 mx-auto" />
          <h1 className="sm:text-2xl md:text-3xl xl:text-4xl font-semibold tracking-custom text-center text-dark-1">
            Welcome Back!
          </h1>
          <p className="sm:text-sm md:text-base xl:text-lg leading-5 tracking-custom2 -mt-2 text-grey-5 text-center">
            Log in to manage teams and tools with AI-powered capabilities to
            enhance every stretch.
          </p>
          <LoginForm />
          <p className="text-grey-5 text-center">
            Don't have an account?{" "}
            <Link className="text-primary-base" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
        <div className="bg-primary-secondary md:w-full xl:w-1/2 hidden md:flex xl:flex justify-center items-center relative">
          <img src={model} alt="model" className="w-[70%] mx-auto z-20" />
          <div className="absolute bg-primary-base md:w-[70px] md:h-[100px] xl:w-[100px] xl:h-[140px] rounded-2xl xl:top-24 md:top-10 xl:right-12 md:right-16" />
          <div className="absolute md:hidden xl:block bg-[#EFE7FF] w-[75%] h-[47px]  bottom-20 left-1/2 -translate-x-1/2" />
          <div className="absolute bg-primary-tertiary md:w-[30%] md:h-[200px] xl:w-[43%] xl:h-[250px]  xl:top-[55%] md:top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-t-full" />
          <div className="absolute bg-white z-40 max-w-[190px] xl:bottom-24 md:bottom-3 md:left-10 xl:py-3 md:py-2 xl:px-3 md:px-2 xl:left-12 rounded-xl">
            <p className="text-dark-1 text-xs font-semibold xl:pb-3 md:pb-2">
            Flexologist
            </p>
            <p className="text-grey-4 text-[10px] border-b-[0.75px] xl:pb-3 md:pb-2 border-[#F2F2F2]">
              Stretch Minds. Heal Bodies. One...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
