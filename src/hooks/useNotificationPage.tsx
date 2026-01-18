import { useNavigate } from "react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionDropdown, type ActionItem } from "@/components/shared";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useNotifications, useUpdateNotification, useDeleteNotification, useMarkAllAsRead } from "@/service/notification";
import {
  transformNotification,
  getBadgeStyles,
  getTypeDisplayName,
  type Notification,
  type NotificationType
} from "@/utils/notification";
import { useMemo, useCallback } from "react";

export const useNotificationPage = () => {
  const navigate = useNavigate();
  const {
    data: notificationsResponse,
    isLoading,
    error,
    refetch,
  } = useNotifications();

  const updateNotificationMutation = useUpdateNotification();
  const deleteNotificationMutation = useDeleteNotification();
  const markAllAsReadMutation = useMarkAllAsRead();

  const originalNotifications = notificationsResponse?.notifications || [];
  const transformedNotifications = originalNotifications.map(transformNotification);

  const notifications = [...transformedNotifications].sort((a, b) => {
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

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const handleMarkAsRead = useCallback((id: number) => {
    updateNotificationMutation.mutate({
      notification_id: id,
      is_read: true,
    });
  }, [updateNotificationMutation]);

  const handleDelete = useCallback((id: number) => {
    deleteNotificationMutation.mutate({
      notification_id: id,
    });
  }, [deleteNotificationMutation]);

  const handleGoToPage = useCallback((type: NotificationType) => {
    switch (type) {
      case "booking":
        navigate("/robot-automation");
        break;
      case "robot automation":
        navigate("/robot-automation");
        break;
      case "note taking":
        navigate("/note-taking-app");
        break;
      case "payment":
        break;
      case "others":
        break;
      default:
        break;
    }
  }, [navigate]);

  const columns = useMemo<ColumnDef<Notification>[]>(() => [
    {
      accessorKey: "type",
      header: "Type",
      size: 140,
      cell: ({ getValue, row }) => {
        const type = getValue() as NotificationType;
        const notification = row.original;
        return (
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs ${!notification.isRead ? 'font-bold' : 'font-medium'} border ${getBadgeStyles(type)}`}
            >
              {getTypeDisplayName(type)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 400,
      cell: ({ getValue, row }) => {
        const description = getValue() as string;
        const notification = row.original;
        const isLongText = description.length > 60;

        return (
          <div className={`text-gray-900 ${!notification.isRead ? 'font-bold' : 'font-medium'}`}>
            {isLongText ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-sm truncate cursor-default">
                    {description}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm">
                  {description}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="max-w-sm truncate cursor-default">
                {description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
      cell: ({ getValue, row }) => {
        const notification = row.original;
        return (
          <div className={`text-gray-600 whitespace-nowrap ${!notification.isRead ? 'font-bold' : 'font-normal'}`}>
            {getValue() as string}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      size: 80,
      cell: ({ row }) => {
        const notification = row.original;

        const actionItems: ActionItem[] = [
          {
            label: updateNotificationMutation.isPending ? "Updating..." : "Mark As Read",
            icon: "check-circle",
            onClick: () => handleMarkAsRead(notification.id),
            disabled: updateNotificationMutation.isPending,
            show: !notification.isRead,
          },
          {
            label: "Navigate To Page",
            icon: "angle-left",
            onClick: () => handleGoToPage(notification.type),
            show: notification.type !== "payment" && notification.type !== "others",
          },
          {
            label: deleteNotificationMutation.isPending ? "Deleting..." : "Delete",
            icon: "trash",
            onClick: () => handleDelete(notification.id),
            disabled: deleteNotificationMutation.isPending,
            destructive: true,
            show: true,
          },
        ];

        return (
          <div className="flex items-center justify-center">
            <ActionDropdown
              items={actionItems}
              disabled={updateNotificationMutation.isPending}
            />
          </div>
        );
      },
    },
  ], [updateNotificationMutation.isPending, deleteNotificationMutation.isPending, handleMarkAsRead, handleDelete, handleGoToPage]);

  return {
    notifications,
    unreadCount,
    columns,
    isLoading,
    error,
    refetch,
    updateNotificationMutation,
    deleteNotificationMutation,
    markAllAsReadMutation,
  };
}; 