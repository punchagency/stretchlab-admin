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
import { useNotifications, useUpdateNotification } from "@/service/notification";
import { transformNotification, getTypeDisplayName, getBadgeStyles } from "@/utils/notification";
import { useNavigate } from "react-router";

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export const NotificationDropdown = ({ children }: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const { data: notificationsResponse } = useNotifications();
  const updateNotificationMutation = useUpdateNotification();
  
  const notifications = notificationsResponse?.notifications?.map(transformNotification) || [];
  const originalNotifications = notificationsResponse?.notifications || [];
  
 
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1; 
    }
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
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-70 overflow-y-auto pb-2">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <>
              {sortedNotifications.slice(0, 5).map((notification) => {
              const originalNotification = originalNotifications.find(orig => orig.id === notification.id);
              return (
                <div key={notification.id} className="p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeStyles(notification.type)}`}>
                          {getTypeDisplayName(notification.type)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-900 mb-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(originalNotification?.created_at || notification.date)}
                      </p>
                    </div>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2 focus-visible:ring-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                        {!notification.isRead && (
                          <DropdownMenuItem 
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={updateNotificationMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
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
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full py-4 px-4 text-sm border border-primary-base text-primary-base bg-white hover:bg-primary-base hover:text-white transition-colors"
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