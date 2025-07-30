import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { renderErrorToast, renderSuccessToast } from "@/components/utils";

export interface NotificationResponse {
  created_at: string;
  id: number;
  is_read: boolean;
  message: string;
  type: string;
  user_id: number;
}

export interface NotificationsApiResponse {
  message: string;
  notifications: NotificationResponse[];
  status: string;
}

export interface UpdateNotificationRequest {
  is_read: boolean;
  notification_id: number;
}

export interface UpdateNotificationResponse {
  message: string;
  status: string;
}

export interface DeleteNotificationRequest {
  notification_id: number;
}

export interface DeleteNotificationResponse {
  message: string;
  status: string;
}

export interface MarkAllAsReadResponse {
  message: string;
  status: string;
}

export const getNotifications = async (): Promise<NotificationsApiResponse> => {
  const response = await api.get<[NotificationsApiResponse, number]>(
    "/notification/"
  );
  return response.data[0];
};

export const updateNotification = async (
  data: UpdateNotificationRequest
): Promise<UpdateNotificationResponse> => {
  const response = await api.post<[UpdateNotificationResponse, number]>(
    "/notification/update",
    data
  );
  return response.data[0];
};

export const deleteNotification = async (
  data: DeleteNotificationRequest
): Promise<DeleteNotificationResponse> => {
  const response = await api.delete<[DeleteNotificationResponse, number]>(
    `/notification/delete/${data.notification_id}`
  );
  return response.data[0];
};

export const markAllAsRead = async (): Promise<MarkAllAsReadResponse> => {
  const response = await api.get<[MarkAllAsReadResponse, number]>('/notification/mark-all-as-read');
  return response.data[0];
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotification,
    onMutate: async (variables: UpdateNotificationRequest) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(
        ["notifications"],
        (old: NotificationsApiResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            notifications: old.notifications.map((notification) =>
              notification.id === variables.notification_id
                ? { ...notification, is_read: variables.is_read }
                : notification
            ),
          };
        }
      );
      return { previousNotifications };
    },
    onSuccess: () => {
      renderSuccessToast("Notification updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      renderErrorToast(
        error?.response?.data?.message || "Failed to update notification"
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onMutate: async (variables: DeleteNotificationRequest) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(
        ["notifications"],
        (old: NotificationsApiResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            notifications: old.notifications.filter(
              (notification) => notification.id !== variables.notification_id
            ),
          };
        }
      );
      return { previousNotifications };
    },
    onSuccess: () => {
      renderSuccessToast("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      renderErrorToast(
        error?.response?.data?.message || "Failed to delete notification"
      );
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old: NotificationsApiResponse | undefined) => {
        if (!old) return old;
        
        return {
          ...old, 
          notifications: old.notifications.map(notification => ({
            ...notification,
            is_read: true
          }))
        };
      });
      return { previousNotifications };
    },
    onSuccess: () => {
      renderSuccessToast("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      renderErrorToast(error?.response?.data?.message || "Failed to mark all notifications as read");
    },
  });
}; 

