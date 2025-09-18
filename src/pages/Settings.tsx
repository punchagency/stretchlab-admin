import { Lock, User, NotebookTabs } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ProfileSection, PasswordSection, CouponSection } from "@/components/settings";
import { getUserInfo } from "@/utils";

const SETTINGS_NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password & Security", icon: Lock },
  { id: "coupon", label: "Coupon", icon: NotebookTabs }
] as const;

export const Settings = () => {
  const person = getUserInfo();
  const settingsData = useSettings();
  const { user, activeSection, setActiveSection } = settingsData;

  const visibleNavItems = SETTINGS_NAV_ITEMS.filter(
    (item) => item.id !== "coupon" || person?.role_id === 1
  );

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading user data...</p>
        </div>
      );
    }
    switch (activeSection) {
      case "profile":
        return <ProfileSection settingsData={settingsData} />;
      case "password":
        return <PasswordSection settingsData={settingsData} />;
      case "coupon":
        return person?.role_id === 1 ? (
          <CouponSection settingsData={settingsData} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You do not have permission to view this section.</p>
          </div>
        );
      default:
        return <ProfileSection settingsData={settingsData} />;
    }
  };

  return (
    <div className="pb-20 ">
      <div className="border-b border-gray-200 px-4 sm:px-7">
        <h1 className="text-base font-semibold mb-3 text-gray-900">
          Manage Settings
        </h1>
      </div>

      <div className="px-5 sm:px-7 mt-5 sm:mt-7">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)]">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 p-4">
              <nav className="space-y-1">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                      ${activeSection === item.id
                        ? 'bg-[#36859133] text-primary-base font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile/Tablet Tab Navigation */}
            <div className="lg:hidden border-b border-gray-200 p-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors
                      ${activeSection === item.id
                        ? 'bg-white text-primary-base font-medium shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `} 
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 py-4 lg:py-4 px-3 lg:px-0 lg:border-l border-border pb-10 min-h-[500px]">
              {renderContent()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};