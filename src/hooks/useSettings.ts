import { useState, useEffect, useMemo, useCallback } from "react";
import { getUserInfo } from "@/utils";
import { getTwoFactorStatus, enableTwoFactor, disableTwoFactor, changePassword, changeEmailInitiate, uploadProfilePicture } from "@/service/settings";
import { renderErrorToast, renderSuccessToast } from "@/components/utils";
import type { ApiError } from "@/types";
import type { ProfileFormData, PasswordFormData, TwoFactorSettings, TwoFactorModalState } from "@/types/settings";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";

export const useSettings = () => {
  const user = useMemo(() => getUserInfo(), []);
  const { profilePictureUrl, refreshProfilePicture, deleteProfilePicture } = useProfilePictureContext();

  const [activeSection, setActiveSection] = useState("profile");
  const [passwordTab, setPasswordTab] = useState<"password" | "2fa">("password");

  const [profileData, setProfileData] = useState<ProfileFormData>({
    username: user?.username || user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings>({
    emailEnabled: false,
    status: "disabled",
  });

  const [twoFactorModal, setTwoFactorModal] = useState<TwoFactorModalState>({
    isOpen: false,
    mode: null,
  });

  const [isLoadingTwoFactor, setIsLoadingTwoFactor] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingEmailChange, setIsLoadingEmailChange] = useState(false);
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false);
  const [isLoadingProfilePictureDelete, setIsLoadingProfilePictureDelete] = useState(false);
  const [hasLoadedTwoFactor, setHasLoadedTwoFactor] = useState(false);

  // Email change modal state
  const [emailChangeModal, setEmailChangeModal] = useState({
    isOpen: false,
    newEmail: "",
  });
  const loadTwoFactorStatus = useCallback(async () => {
    try {
      const response = await getTwoFactorStatus();
      if (response.status === 200) {
        let emailEnabled = false;
        let status: "enabled" | "disabled" | "pending" = "disabled";

        if (response.data.two_factor_auth === true) {
          emailEnabled = true;
          status = "enabled";
        } else if (response.data.two_factor_auth === null) {
          emailEnabled = false;
          status = "pending";
        } else {
          emailEnabled = false;
          status = "disabled";
        }

        setTwoFactorSettings({
          emailEnabled,
          status,
        });
        setHasLoadedTwoFactor(true);
      }
    } catch (error) {
      setTwoFactorSettings({
        emailEnabled: false,
        status: "disabled",
      });
      setHasLoadedTwoFactor(true);
    }
  }, []);

  useEffect(() => {
    if (user && !hasLoadedTwoFactor) {
      loadTwoFactorStatus();
    }
  }, [user, hasLoadedTwoFactor, loadTwoFactorStatus]);



  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTwoFactorToggle = async (field: keyof TwoFactorSettings) => {
    if (field === "emailEnabled") {
      const currentlyEnabled = twoFactorSettings.emailEnabled;
      try {
        setIsLoadingTwoFactor(true);

        if (currentlyEnabled) {
          const response = await disableTwoFactor();
          if (response.status === 200) {
            setTwoFactorModal({
              isOpen: true,
              mode: "disable",
            });
          } else {
            renderErrorToast(response.data.message || "Failed to initiate 2FA disable");
          }
        } else {
          const response = await enableTwoFactor();
          if (response.status === 200) {
            setTwoFactorModal({
              isOpen: true,
              mode: "enable",
            });
          } else {
            renderErrorToast(response.data.message || "Failed to initiate 2FA enable");
          }
        }
      } catch (error) {
        const apiError = error as ApiError;
        renderErrorToast(apiError.response?.data.message || "Failed to toggle 2FA");
      } finally {
        setIsLoadingTwoFactor(false);
      }
    }
  };

  const handleTwoFactorModalClose = () => {
    setTwoFactorModal({
      isOpen: false,
      mode: null,
    });
  };

  const handleTwoFactorSuccess = async () => {
    try {
      const response = await getTwoFactorStatus();
      if (response.status === 200) {
        let emailEnabled = false;
        let status: "enabled" | "disabled" | "pending" = "disabled";

        if (response.data.two_factor_auth === true) {
          emailEnabled = true;
          status = "enabled";
        } else if (response.data.two_factor_auth === null) {
          emailEnabled = false;
          status = "pending";
        } else {
          emailEnabled = false;
          status = "disabled";
        }

        setTwoFactorSettings({
          emailEnabled,
          status,
        });
      }
    } catch (error) {
      setTwoFactorSettings(prev => ({
        ...prev,
        emailEnabled: twoFactorModal.mode === "enable",
      }));
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          renderErrorToast('File size must be less than 5MB');
          return;
        }

        if (!file.type.startsWith('image/')) {
          renderErrorToast('Please select a valid image file');
          return;
        }

        try {
          setIsLoadingProfilePicture(true);
          const response = await uploadProfilePicture(file);

          if (response.status === 200) {
            renderSuccessToast(response.data.message || 'Profile picture uploaded successfully');
            await refreshProfilePicture();
          } else {
            renderErrorToast(response.data.message || 'Failed to upload profile picture');
          }
        } catch (error) {
          const apiError = error as ApiError;
          renderErrorToast(apiError.response?.data.message || 'Failed to upload profile picture');
        } finally {
          setIsLoadingProfilePicture(false);
        }
      }
    };
    input.click();
  };

  const handleImageDelete = async () => {
    try {
      setIsLoadingProfilePictureDelete(true);
      await deleteProfilePicture();
      renderSuccessToast("Profile picture deleted successfully");
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response?.data.message || "Failed to delete profile picture");
    } finally {
      setIsLoadingProfilePictureDelete(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      renderErrorToast("User not authenticated");
      return;
    }
    const emailChanged = profileData.email !== user.email;
    if (emailChanged) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        renderErrorToast("Please enter a valid email address");
        return;
      }
      try {
        setIsLoadingEmailChange(true);
        const response = await changeEmailInitiate(profileData.email);

        if (response.status === 200) {
          renderSuccessToast("Verification code sent to your new email address");
          setEmailChangeModal({
            isOpen: true,
            newEmail: profileData.email,
          });
        } else {
          renderErrorToast(response.data.message || "Failed to initiate email change");
        }
      } catch (error) {
        const apiError = error as ApiError;
        renderErrorToast(apiError.response?.data.message || "Failed to initiate email change");
      } finally {
        setIsLoadingEmailChange(false);
      }
    } else {
      renderErrorToast("Current email is the same as the new email");
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      renderErrorToast("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      renderErrorToast("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      renderErrorToast("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      renderErrorToast("New password must be different from current password");
      return;
    }

    try {
      setIsLoadingPassword(true);
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);

      if (response.status === 200) {
        renderSuccessToast(response.data.message || "Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        renderErrorToast(response.data.message || "Failed to update password");
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response?.data.message || "Failed to update password");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleEmailChangeModalClose = () => {
    setEmailChangeModal({
      isOpen: false,
      newEmail: "",
    });
    setProfileData(prev => ({
      ...prev,
      email: user?.email || "",
    }));
  };

  return {
    user,
    activeSection,
    passwordTab,
    profileData,
    profileImage: profilePictureUrl,
    passwordData,
    twoFactorSettings,
    twoFactorModal,
    emailChangeModal,
    isLoadingTwoFactor,
    isLoadingPassword,
    isLoadingEmailChange,
    isLoadingProfilePicture,
    isLoadingProfilePictureDelete,
    hasProfileImage: Boolean(profilePictureUrl),
    setActiveSection,
    setPasswordTab,
    handleProfileInputChange,
    handlePasswordInputChange,
    handleTwoFactorToggle,
    handleImageUpload,
    handleImageDelete,
    handleSaveProfile,
    handleUpdatePassword,
    handleTwoFactorModalClose,
    handleTwoFactorSuccess,
    handleEmailChangeModalClose,
  };
}; 