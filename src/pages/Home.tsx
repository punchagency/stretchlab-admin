import {
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  SidebarMenu,
  SidebarFooter,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import logo from "@/assets/images/stretchlab.png";
import logoIcon from "@/assets/images/stretchlab-favicon.png";
import { Outlet } from "react-router";
import { menuList } from "@/lib/contants";
import { NavUser, SideMenuList } from "@/components/shared";

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
  return (
    <SidebarProvider>
      <Sidebar className="p-2" collapsible="icon">
        <SidebarHeader className="pt-5">
          <SidebarLogo />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="py-5">
          <SidebarMenu className="flex flex-col">
            {menuList.map((menu) => (
              <SideMenuList
                key={menu.title}
                title={menu.title}
                icon={menu.icon}
                link={menu.link}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="flex-1">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
};
