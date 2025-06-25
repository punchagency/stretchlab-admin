import { useState, useEffect, useMemo, useCallback } from "react";
import { getUserInfo } from "@/utils";
import { getTwoFactorStatus, enableTwoFactor, disableTwoFactor, resendTwoFactorCode, changePassword } from "@/service/settings";
import { renderErrorToast, renderSuccessToast } from "@/components/utils";
import type { ApiError } from "@/types";
import type { ProfileFormData, PasswordFormData, TwoFactorSettings, TwoFactorModalState } from "@/types/settings";

export const useSettings = () => {
  const user = useMemo(() => getUserInfo(), []);
   const [activeSection, setActiveSection] = useState("profile");
  const [passwordTab, setPasswordTab] = useState<"password" | "2fa">("password");
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    username: user?.username || user?.name || "",
    email: user?.email || "",
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null);
  
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
  const [hasLoadedTwoFactor, setHasLoadedTwoFactor] = useState(false);
  const loadTwoFactorStatus = useCallback(async () => {
    if (hasLoadedTwoFactor) return; 
    
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
      console.error("Failed to load 2FA status:", error);
      setTwoFactorSettings({
        emailEnabled: false,
        status: "disabled",
      });
      setHasLoadedTwoFactor(true);
    }
  }, [hasLoadedTwoFactor]);

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
      const currentStatus = twoFactorSettings.status;
      console.log("currentlyEnabled", currentlyEnabled);
      console.log("currentStatus", currentStatus);
      
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
          if (currentStatus === "pending") {
            const response = await resendTwoFactorCode();
            if (response.status === 200) {
              setTwoFactorModal({
                isOpen: true,
                mode: "resend",
              });
              renderSuccessToast("New verification code sent successfully");
            } else {
              renderErrorToast(response.data.message || "Failed to resend verification code");
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
    setHasLoadedTwoFactor(false);
    
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
      console.error("Failed to refresh 2FA status:", error);
      setTwoFactorSettings(prev => ({
        ...prev,
        emailEnabled: twoFactorModal.mode === "enable",
      }));
      setHasLoadedTwoFactor(true);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setProfileImage(result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleImageDelete = () => {
    setProfileImage(null);
    console.log("Profile image deleted");
  };

  const handleSaveProfile = () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const dataToSave = {
      ...profileData,
      profileImage: profileImage,
      userId: user.sub,
    };
    
    console.log("Save profile changes", dataToSave);
    alert("Profile changes saved successfully!"); 
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
        // Clear the form after successful update
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

  return {
    user,
    activeSection,
    passwordTab,
    profileData,
    profileImage,
    passwordData,
    twoFactorSettings,
    twoFactorModal,
    isLoadingTwoFactor,
    isLoadingPassword,
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
  };
}; 