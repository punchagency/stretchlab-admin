import { Button, Input, SvgIcon } from "@/components/shared";
import { Avatar } from "@/components/ui/avatar";
import avatarImage from "@/assets/images/avatar.png";
import { useSettings } from "@/hooks/useSettings";

export const ProfileSection = () => {
  const {
    user,
    profileData,
    profileImage,
    handleProfileInputChange,
    handleImageUpload,
    handleImageDelete,
    handleSaveProfile,
  } = useSettings();

  const handleUploadToBackend = () => {
    console.log("Uploading image to backend...");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 px-6">
        <h2 className="text-base text-gray-900 mb-1 font-semibold">
          Change Profile Information
        </h2>
        <p className="text-sm text-muted-foreground">
          You can invite multiple team members at a time.
        </p>
      </div>

      <div className="space-y-4 px-6">
        <div className="flex flex-col items-start space-y-3">
          <span className="text-sm text-muted-foreground">Profile picture</span>

          <div className=" space-y-4 flex-col flex items-start">
            <div className="relative group">
              <Avatar className="w-30 h-30">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <img
                    src={avatarImage}
                    alt="Default Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
                
                <div 
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                  onClick={handleImageUpload}
                >
                  <SvgIcon
                    name="edit"
                    width={20}
                    height={20}
                    fill="white"
                  />
                </div>
              </Avatar>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleUploadToBackend}
                className="py-2 px-4 text-sm border border-primary-base text-primary-base bg-white hover:bg-primary-base hover:text-white transition-colors rounded-md"
              >
                Upload image
              </Button>
              <Button
                onClick={handleImageDelete}
                className="py-2 px-4 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-colors rounded-md"
              >
                Delete picture
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6">
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={profileData.username}
          onChange={handleProfileInputChange}
          className="py-3 rounded-md"
          labelStyle="text-sm font-medium"
          disabled={true}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={profileData.email}
          onChange={handleProfileInputChange}
          className="py-3 rounded-md"
          labelStyle="text-sm font-medium"
        />
      </div>

      <div className="pt-4 px-6">
        <Button
          onClick={handleSaveProfile}
          className="flex items-center w-fit md:w-auto gap-2 py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}; 