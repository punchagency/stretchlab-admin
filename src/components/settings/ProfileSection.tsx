import { Button, Input, Spinner } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/hooks/useSettings";
import { EmailChangeModal } from "./EmailChangeModal";

type ProfileSectionProps = {
  settingsData: ReturnType<typeof useSettings>;
};

export const ProfileSection = ({ settingsData }: ProfileSectionProps) => {
  const {
    user,
    profileData,
    profileImage,
    emailChangeModal,
    isLoadingEmailChange,
    isLoadingProfilePicture,
    isLoadingProfilePictureDelete,
    hasProfileImage,
    handleProfileInputChange,
    handleImageUpload,
    handleImageDelete,
    handleSaveProfile,
    handleEmailChangeModalClose,
  } = settingsData;

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
                <AvatarImage src={profileImage || undefined} alt="Profile" />
                <AvatarFallback className="text-2xl font-semibold capitalize">
                  {user?.username?.charAt(0) || "U"}
                </AvatarFallback>
                {/* <div 
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
                </div> */}
              </Avatar>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleImageUpload}
                disabled={isLoadingProfilePicture}
                className="py-2 px-4 text-sm border border-primary-base text-primary-base bg-white hover:bg-primary-base hover:text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingProfilePicture ? (
                  <>
                    <Spinner className="border-primary-base w-4 h-4" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Change picture"
                )}
              </Button>
              <Button
                onClick={handleImageDelete}
                disabled={isLoadingProfilePictureDelete || !hasProfileImage}
                className="py-2 px-4 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingProfilePictureDelete ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="border-red-500 w-4 h-4" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete picture"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6">
        <div className="space-y-1">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={profileData.username}
            onChange={handleProfileInputChange}
            className="py-3 rounded-md bg-gray-50"
            labelStyle="text-sm font-medium"
            disabled={true}
          />
          <p className="text-xs text-muted-foreground">
            Username cannot be changed
          </p>
        </div>

        <div className="space-y-1">
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
          <p className="text-xs text-muted-foreground">
            Changing your email will require verification
          </p>
        </div>
      </div>

      <div className="pt-4 px-6">
        <Button
          onClick={handleSaveProfile}
          disabled={isLoadingEmailChange}
          className="flex items-center w-fit md:w-auto gap-2 py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingEmailChange ? (
            <>
              <Spinner className="border-white w-4 h-4" />
              <span>Processing...</span>
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
      <EmailChangeModal
        isOpen={emailChangeModal.isOpen}
        onClose={handleEmailChangeModalClose}
        newEmail={emailChangeModal.newEmail}
      />
    </div>
  );
}; 