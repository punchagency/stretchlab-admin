import {
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import logo from "@/assets/images/stretchnote.png";
// import logoIcon from "@/assets/images/stretchlab-favicon.png";
import { Outlet, useNavigate, Navigate } from "react-router";
import { menuList } from "@/lib/contants";
import { SideMenuList, LogoutMenu } from "@/components/shared";
import { useEffect } from "react";
import { getUserCookie, getUserInfo } from "@/utils";
import { MainHeader } from "@/components/shared";
import { ProfilePictureProvider } from "@/contexts/ProfilePictureContext";

const SidebarLogo = () => {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  return (
    <button
      onClick={() => navigate(userInfo?.role_id === 5 ? "/booking-bridge" : "/dashboard")}
    >
      <img
        src={logo}
        alt="logo"
        className={state === "expanded" ? "" : "w-25"}
      />
    </button>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  console.log({ userInfo });
  useEffect(() => {
    const userCookie = getUserCookie();
    if (!userCookie) {
      navigate("/login");
    }
    // add the is_verified and rpa_verified to the token
    if (userInfo?.is_verified && !userInfo.is_verified) {
      navigate(`/verification`);
    }
    if (userInfo?.requires_2fa) {
      navigate(`/2fa-login?email=${encodeURIComponent(userInfo.email)}`);
    }
    const isRpaVerifiedCheckExists = Object.keys(userInfo as object).find((key) => key === "rpa_verified");

    if (
      isRpaVerifiedCheckExists &&
      !userInfo?.rpa_verified &&
      userInfo?.role_id !== 1 &&
      userInfo?.role_id !== 8 &&
      userInfo?.role_id !== 4 &&
      userInfo?.role_id !== 5
    ) {
      navigate("/robot-setup");
    }

    if (
      Object.keys(userInfo as object).find((key) => key === "is_verified") &&
      !userInfo?.is_verified
    ) {
      navigate(`/verification`);
    }

  }, []);

  if (!getUserCookie()) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo?.role_id === 5 && (window.location.pathname === "/" || window.location.pathname === "/dashboard")) {
    return <Navigate to="/booking-bridge" replace />;
  }

  const filteredMenuList = menuList.filter((menu) => {
    if (
      (userInfo?.role_id === 1 ||
        userInfo?.role_id === 8 ||
        userInfo?.role_id === 4) &&
      menu.title === "Billing"
    ) {

      return false;
    }
    if (menu.title === "User Management" && ![1, 2].includes(userInfo?.role_id ?? -1)) {
      return false;
    }

    if (menu.title === "Report" && userInfo?.role_id !== 1) {
      return false;
    }
    if (menu.title === "Note Formatting" && userInfo?.role_id !== 1) {
      return false;
    }
    if (menu.title === "Support" && ![1, 2, 5].includes(userInfo?.role_id ?? -1)) {
      return false;
    }
    if (userInfo?.role_id === 5) {
      const allowed = ["Booking Bridge", "Notification", "Support", "Settings"];
      if (!allowed.includes(menu.title)) return false;
    }

    return true;
  });

  return (
    <ProfilePictureProvider>
      <SidebarProvider>
        <Sidebar className="border-sidebar-border" collapsible="icon">
          <SidebarHeader className="pt-2">
            <SidebarLogo />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent className="py-5">
            <SidebarMenu className="flex flex-col">
              {filteredMenuList.map((menu) => (
                <SideMenuList
                  key={menu.title}
                  title={menu.title}
                  icon={menu.icon}
                  link={menu.link}
                />
              ))}
              <LogoutMenu />
            </SidebarMenu>
          </SidebarContent>
          {/* <SidebarFooter>
            <NavUser />
          </SidebarFooter> */}
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 bg-white overflow-x-hidden">
          <MainHeader />
          <div>
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </ProfilePictureProvider>
  );
};
