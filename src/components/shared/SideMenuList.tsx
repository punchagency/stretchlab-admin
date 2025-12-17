import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { SvgIcon, Modal, Spinner } from ".";
import type { SvgIconName } from "@/types";
import { useNavigate, useLocation } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { deleteUserCookie, getRefreshToken } from "@/utils";
import { logout } from "@/service/auth";
import { renderErrorToast } from "../utils";

export const SideMenuList = ({
  title,
  icon,
  link,
}: {
  title: string;
  icon: React.ReactNode;
  link?: string;
}) => {
  const navigate = useNavigate();
  const pathname = useLocation();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const handleNavigate = () => {
    if (link) {
      navigate(link);
      if (isMobile) {
        toggleSidebar();
      }
    }
  };

  return (
    <SidebarMenuItem className="rounded-lg">
      <SidebarMenuButton
        size="lg"
        onClick={handleNavigate}
        className={`text-[#667185] ${pathname.pathname === link
          ? "bg-primary-base text-white hover:bg-primary-base hover:text-white"
          : ""
          }`}
        tooltip={isMobile ? undefined : title}
      >
        <SvgIcon
          width={24}
          fill={pathname.pathname === link ? "white" : undefined}
          height={24}
          name={icon as SvgIconName}
        />

        <span className="text-base font-medium">{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const LogoutMenu = () => {
  const isMobile = useIsMobile();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const response = await logout(refreshToken);
        if (response.status === 200 || response.status === 204) {
          deleteUserCookie();
          window.location.href = "/login";
        } else {
          renderErrorToast("Logout failed. Please try again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Logout failed", error);
        renderErrorToast("An error occurred during logout.");
        setIsLoading(false);
      }
    } else {
      deleteUserCookie();
      window.location.href = "/login";
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <>
      <SidebarMenuItem className="rounded-lg">
        <SidebarMenuButton
          size="lg"
          onClick={handleLogoutClick}
          className="text-[#667185]"
          tooltip={isMobile ? undefined : "Logout"}
        >
          <SvgIcon
            width={24}
            fill={undefined}
            height={24}
            name="logout"
          />

          <span className="text-base font-medium">Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Modal show={isLogoutModalOpen} onClose={() => !isLoading && setIsLogoutModalOpen(false)} size="sm">
        <div className="flex flex-col items-center p-4">
          <h1 className="text-lg font-semibold mb-4">
            Are you sure you want to log out?
          </h1>
          <div className="flex gap-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Logging out...</span>
                </>
              ) : (
                "Log Out"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
