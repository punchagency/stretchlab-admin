import { MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotifications, useUpdateNotification, useDeleteNotification } from "@/service/notification";
import { transformNotification, getTypeDisplayName, getBadgeStyles } from "@/utils/notification";
import { useNavigate } from "react-router";

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export const NotificationDropdown = ({ children }: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const { data: notificationsResponse } = useNotifications();
  const updateNotificationMutation = useUpdateNotification();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications = notificationsResponse?.notifications?.map(transformNotification) || [];
  const originalNotifications = notificationsResponse?.notifications || [];

  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  const sortedUnreadNotifications = [...unreadNotifications].sort((a, b) => {
    const aOriginal = originalNotifications.find(orig => orig.id === a.id);
    const bOriginal = originalNotifications.find(orig => orig.id === b.id);
    if (aOriginal && bOriginal) {
      const aDate = new Date(aOriginal.created_at).getTime();
      const bDate = new Date(bOriginal.created_at).getTime();
      return bDate - aDate;
    }
    return 0;
  });

  const handleMarkAsRead = (id: number) => {
    updateNotificationMutation.mutate({
      notification_id: id,
      is_read: true,
    });
  };

  const handleDelete = (id: number) => {
    deleteNotificationMutation.mutate({
      notification_id: id,
    });
  };

  const formatTimeAgo = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[90vw] sm:w-80 max-w-sm ml-2 sm:ml-0"
        sideOffset={8}
        alignOffset={-58}
      >

        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">Notifications</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-[60vh] sm:max-h-70 overflow-y-auto pb-2">
          {unreadNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No unread notifications</p>
            </div>
          ) : (
            <>
              {sortedUnreadNotifications.slice(0, 5).map((notification) => {
                const originalNotification = originalNotifications.find(orig => orig.id === notification.id);
                return (
                  <div key={notification.id} className="p-2 sm:p-3 mx-2 hover:bg-gray-50 rounded-lg border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeStyles(notification.type)} whitespace-nowrap`}>
                            {getTypeDisplayName(notification.type)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 mb-2 line-clamp-2 leading-relaxed">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(originalNotification?.created_at || notification.date)}
                        </p>
                      </div>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2 focus-visible:ring-0 flex-shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                          className="w-44"
                        >
                          {!notification.isRead && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={updateNotificationMutation.isPending}
                              className="text-sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(notification.id)}
                            disabled={deleteNotificationMutation.isPending}
                            className="text-red-600 text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full py-3 px-4 text-sm border border-primary-base text-primary-base bg-white hover:bg-primary-base hover:text-white transition-colors rounded-lg"
            onClick={() => navigate('/notification')}
            style={{
              paddingBlock: '20px',
            }}
          >
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 