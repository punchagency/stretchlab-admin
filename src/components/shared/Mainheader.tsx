import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUserInfo } from "@/utils";

export const MainHeader = () => {
    const user = getUserInfo();
    const avatar = "https://github.com/shadcn.png";
    return (
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center">
          <SidebarTrigger className="p-2" />
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="h-6 w-6 text-primary-base cursor-pointe" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary-base rounded-full text-[10px] text-white flex items-center justify-center">
              1
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt="profile" />
              <AvatarFallback className="capitalize">{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            
          </div>
        </div>
      </header>
    );
  };