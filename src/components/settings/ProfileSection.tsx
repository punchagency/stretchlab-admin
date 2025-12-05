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
      <div className="border-b border-border pb-3 sm:pb-4 px-2 sm:px-6">
        <h2 className="text-base text-gray-900 mb-1 font-semibold">
          Change Profile Information
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          You can invite multiple team members at a time.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 px-2 sm:px-6">
        <div className="flex flex-col items-center sm:items-start space-y-2 sm:space-y-3">
          <span className="text-sm text-muted-foreground">Profile picture</span>

          <div className="space-y-3 sm:space-y-4 flex-col flex items-center sm:items-start w-full">
            <div className="relative group">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30">
                <AvatarImage src={profileImage || undefined} alt="Profile" />
                <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-semibold capitalize">
                  {user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={handleImageUpload}
                disabled={isLoadingProfilePicture}
                className="py-2 px-4 text-sm border border-primary-base text-primary-base bg-white hover:bg-primary-base hover:text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                className="py-2 px-4 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingProfilePictureDelete ? (
                  <>
                    <Spinner className="border-red-500 w-4 h-4" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete picture"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-2 sm:px-6">
        <div className="space-y-1">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={profileData.username}
            onChange={handleProfileInputChange}
            className="py-3 rounded-md bg-gray-50 text-sm"
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
            className="py-3 rounded-md text-sm"
            labelStyle="text-sm font-medium"
          />
          <p className="text-xs text-muted-foreground">
            Changing your email will require verification
          </p>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 px-2 sm:px-6">
        <Button
          onClick={handleSaveProfile}
          disabled={isLoadingEmailChange}
          className="flex items-center justify-center w-full sm:w-auto gap-2 py-3 text-white bg-primary-base hover:bg-primary-base/90 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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