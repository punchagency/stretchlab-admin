import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from './api';
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

export const getNotifications = async (): Promise<NotificationsApiResponse> => {
  const response = await api.get<[NotificationsApiResponse, number]>('/notification');
  return response.data[0];
};

export const updateNotification = async (data: UpdateNotificationRequest): Promise<UpdateNotificationResponse> => {
  const response = await api.post<[UpdateNotificationResponse, number]>('/notification/update', data);
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
      queryClient.setQueryData(["notifications"], (old: NotificationsApiResponse | undefined) => {
        if (!old) return old;
        
        return {
          ...old, 
          notifications: old.notifications.map(notification => 
            notification.id === variables.notification_id
              ? { ...notification, is_read: variables.is_read }
              : notification
          )
        };
      });
      return { previousNotifications };
    },
    onSuccess: () => {
      renderSuccessToast("Notification updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      renderErrorToast(error?.response?.data?.message || "Failed to update notification");
    },
  });
}; 