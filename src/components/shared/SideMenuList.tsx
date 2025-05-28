import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SvgIcon } from ".";
import type { SvgIconName } from "@/types";
import { useNavigate, useLocation } from "react-router";
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
  const handleNavigate = () => {
    if (link) {
      navigate(link);
    }
  };
  console.log(pathname.pathname, link);
  return (
    <SidebarMenuItem className="rounded-lg">
      <SidebarMenuButton
        size="lg"
        onClick={handleNavigate}
        className={`text-[#667185] ${
          pathname.pathname === link
            ? "bg-primary-base text-white hover:bg-primary-base hover:text-white"
            : ""
        }`}
        tooltip={title}
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
