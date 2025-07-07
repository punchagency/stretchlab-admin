import { DataTable } from "@/components/datatable";
import { ContainLoader } from "@/components/shared";
import { ErrorHandle } from "@/components/app";
import { useNotificationPage } from "@/hooks/useNotificationPage";

export const Notification = () => {
  const {
    notifications,
    unreadCount,
    columns,
    isLoading,
    error,
    refetch,
  } = useNotificationPage();

  if (isLoading) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Fetching notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%]">
        <ErrorHandle retry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 ml-1">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-accent-base text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
       
            <DataTable
              columns={columns}
              data={notifications}
              emptyText="No notifications found"
              tableContainerClassName="w-[90vw]"
            />
       
      </div>
    </div>
  );
};


