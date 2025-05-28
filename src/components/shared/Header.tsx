import logo from "../../assets/images/stretchlab.png";
import avatar from "../../assets/images/avatar.png";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export const Header = ({
  flexologist_name,
  handleLogout,
}: {
  flexologist_name: string;
  handleLogout: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex laptop:flex-row tablet:flex-col phone:flex-col laptop:gap-[15%] tablet:gap-4 phone:gap-6 border-b border-neutral-tertiary py-4 laptop:items-center tablet:items-start">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="logo"
            className="laptop:w-28 tablet:w-20 laptop:h-10 tablet:h-8 phone:w-20 phone:h-8"
          />
          <button
            className="laptop:hidden tablet:hidden phone:block"
            onClick={() => setIsSidebarOpen(true)}
          >
            <img src={avatar} alt="avatar" className="w-10 h-10" />
          </button>
        </div>
        <div className="flex-1 flex w-full items-center ">
          <div>
            <h4 className="text-dark-1 font-semibold phone:text-xl text-2xl">
              Welcome back!{" "}
              <span className="text-grey-2">{flexologist_name}</span>
            </h4>
            <p className="text-grey-5 text-base">
              Ready to help your clients move better today?
            </p>
          </div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="ml-auto phone:hidden cursor-pointer border-neutral-base border-2 rounded-lg laptop:flex tablet:flex items-center gap-2 px-4 py-2"
          >
            <div>
              <img src={avatar} alt="avatar" className="w-10 h-10" />
            </div>
            <div>
              <p className="text-dark-1 font-medium">{flexologist_name}</p>
              <p className="text-neutral-secondary text-sm">Flexologist</p>
            </div>
          </button>
        </div>
        {isDropdownOpen && (
          <div className="absolute right-4 laptop:top-24 tablet:top-32 bg-white rounded-lg border-neutral-base border-2 p-2 w-44">
            <button
              onClick={handleLogout}
              className="text-dark-1 hover:text-red-500 text-sm w-full font-semibold py-2 text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <div className="flex flex-col h-full relative">
          <div className="flex items-center gap-4 mb-6">
            <img src={avatar} alt="avatar" className="w-12 h-12" />
            <div>
              <p className="text-dark-1 font-medium text-lg">
                {flexologist_name}
              </p>
              <p className="text-neutral-secondary text-sm">Flexologist</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="absolute bottom-0 left-0 w-full text-base text-red-500 font-semibold py-2 text-center border-t border-neutral-tertiary"
          >
            Logout
          </button>
        </div>
      </Sidebar>
    </>
  );
};
