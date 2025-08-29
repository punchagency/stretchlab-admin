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
import logo from "@/assets/images/stretchlab.png";
import logoIcon from "@/assets/images/stretchlab-favicon.png";
import { Outlet, useNavigate } from "react-router";
import { menuList } from "@/lib/contants";
import { SideMenuList, LogoutMenu } from "@/components/shared";
import { useEffect } from "react";
import { getUserCookie, getUserInfo } from "@/utils";
import { MainHeader } from "@/components/shared";
import { ProfilePictureProvider } from "@/contexts/ProfilePictureContext";

const SidebarLogo = () => {
  const { state } = useSidebar();

  return (
    <img
      src={state === "expanded" ? logo : logoIcon}
      alt="logo"
      className={state === "expanded" ? "w-24 h-10" : "w-10 h-9 ml-1"}
    />
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  useEffect(() => {
    const userCookie = getUserCookie();
    if (!userCookie) {
      navigate("/login");
    }
    // add the is_verified and rpa_verified to the token
    if (
      Object.keys(userInfo as object).find((key) => key === "is_verified") &&
      !userInfo?.is_verified
    ) {
      navigate(`/verification`);
    }
    if (userInfo?.requires_2fa) {
      navigate(`/2fa-login?email=${encodeURIComponent(userInfo.email)}`);
    }
    if (
      Object.keys(userInfo as object).find((key) => key === "rpa_verified") &&
      !userInfo?.rpa_verified &&
      userInfo?.role_id !== 1 &&
      userInfo?.role_id !== 8 &&
      userInfo?.role_id !== 4
    ) {
      navigate("/robot-setup");
    }
  }, []);

  const filteredMenuList = menuList.filter((menu) => {
    if (
      (userInfo?.role_id === 1 ||
        userInfo?.role_id === 8 ||
        userInfo?.role_id === 4) &&
      menu.title === "Billing"
    ) {
      return false;
    }
    if (menu.title === "User Management" && userInfo?.role_id !== 1) {
      return false;
    }

    return true;
  });

  return (
    <ProfilePictureProvider>
      <SidebarProvider>
        <Sidebar className="p-2 border-sidebar-border" collapsible="icon">
          <SidebarHeader className="pt-5">
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
        <div className="flex-1 bg-white">
          <MainHeader />
          <div>
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </ProfilePictureProvider>
  );
};
