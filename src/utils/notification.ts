import type { NotificationResponse } from "@/service/notification";

export type NotificationType = "booking" | "payment" | "note taking";

export interface Notification {
  id: number;
  type: NotificationType;
  description: string;
  date: string;
  isRead: boolean;
}

export const getBadgeStyles = (type: NotificationType) => {
  switch (type) {
    case "booking":
      return "bg-purple-100 text-purple-800 border-purple-200 ";
    case "payment":
      return "bg-green-100 text-green-800 border-green-200";
    case "note taking":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getTypeDisplayName = (type: NotificationType) => {
  switch (type) {
    case "note taking":
      return "Note Taking";
    case "booking":
      return "Booking";
    case "payment":
      return "Payment";
    default:
      return type;
  }
};

const normalizeType = (type: string): NotificationType => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('note') || lowerType.includes('taking')) {
    return 'note taking';
  }
  if (lowerType.includes('booking')) {
    return 'booking';
  }
  if (lowerType.includes('payment')) {
    return 'payment';
  }
  return 'note taking';
};

export const transformNotification = (apiNotification: NotificationResponse): Notification => {
  return {
    id: apiNotification.id,
    type: normalizeType(apiNotification.type),
    description: apiNotification.message,
    date: new Date(apiNotification.created_at).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    isRead: apiNotification.is_read,
  };
}; 