import { Bell, Lock, User } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ProfileSection, PasswordSection } from "@/components/settings";

// Settings navigation items
const SETTINGS_NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password & Security", icon: Lock },
  { id: "notification", label: "Notification", icon: Bell },
] as const;

export const Settings = () => {
  const settingsData = useSettings();
  const { user, activeSection, setActiveSection } = settingsData;

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
      case "notification":
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Notification section coming soon...</p>
          </div>
        );
      default:
        return <ProfileSection settingsData={settingsData} />;
    }
  };

  return (
    <div className="pb-20">
      <div className="border-b border-gray-200 px-7">
        <h1 className="text-base font-semibold mb-3 text-gray-900">
          Manage Settings
        </h1>
      </div>

      <div className="px-7 mt-7">
        <div className="max-w-6xl mx-auto">
          <div className="flex bg-white rounded-lg shadow-md">
            
            
            <div className="w-64 flex-shrink-0 p-4">
              <nav className="space-y-1">
                {SETTINGS_NAV_ITEMS.map((item) => (
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
            <div className="flex-1 py-4 border-l border-border pb-10 min-h-[500px]">
              {renderContent()}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};