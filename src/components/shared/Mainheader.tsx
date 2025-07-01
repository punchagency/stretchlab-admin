import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUserInfo } from "@/utils";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import { useNotifications } from "@/service/notification";
import { transformNotification } from "@/utils/notification";
import { NotificationDropdown } from "./NotificationDropdown";

export const MainHeader = () => {
    const user = getUserInfo();
    const { profilePictureUrl } = useProfilePictureContext();
    
    const { data: notificationsResponse } = useNotifications();
    const notifications = notificationsResponse?.notifications?.map(transformNotification) || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return (
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center">
          <SidebarTrigger className="p-2" />
        </div>
        <div className="flex items-center gap-6">
          <NotificationDropdown>
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6 text-primary-base" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-base rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </NotificationDropdown>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profilePictureUrl || undefined} alt="profile" />
              <AvatarFallback className="capitalize">{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    );
  };