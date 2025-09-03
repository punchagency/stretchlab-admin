import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUserInfo } from "@/utils";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import { useNotifications } from "@/service/notification";
import { transformNotification } from "@/utils/notification";
import { NotificationDropdown } from "./NotificationDropdown";
import { Button } from "@/components/shared";
import { ExternalLink } from "lucide-react";

const redirectURL = import.meta.env.VITE_REDIRECT_URL;

export const MainHeader = () => {
  const user = getUserInfo();
  const { profilePictureUrl } = useProfilePictureContext();
  const { data: notificationsResponse } = useNotifications();

  const notifications =
    notificationsResponse?.notifications?.map(transformNotification) || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleVisitFlexologist = () => {
    window.open(redirectURL, "_self");

  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 mb-4">
      <div className="flex items-center">
        <SidebarTrigger className="p-2" />
      </div>
      <div className="flex items-center gap-6">
        {user?.role_id === 8 && (
          <Button
            onClick={handleVisitFlexologist}
            className="bg-primary-base text-white hover:bg-primary-base/80 font-medium py-2 px-1 text-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Switch to Note App
          </Button>
        )}

        <NotificationDropdown>
          <div className="relative cursor-pointer">
            <Bell className="h-6 w-6 text-primary-base" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-base rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </NotificationDropdown>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profilePictureUrl || undefined} alt="profile" />
            <AvatarFallback className="capitalize">
              {user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

