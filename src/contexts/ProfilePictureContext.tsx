import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfilePicture, deleteProfilePicture } from "@/service/settings";
import { getUserInfo } from "@/utils/user";

interface ProfilePictureContextType {
  profilePictureUrl: string | null;
  isLoading: boolean;
  refreshProfilePicture: () => Promise<void>;
  deleteProfilePicture: () => Promise<void>;
}

const ProfilePictureContext = createContext<ProfilePictureContextType | undefined>(undefined);

export const ProfilePictureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadProfilePicture = useCallback(async () => {
    if (hasLoaded) return;
    const user = getUserInfo();
    if (!user) {
      setHasLoaded(true);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await getProfilePicture();
      if (response.status === 200 && response.data.profile_picture_url) {
        setProfilePictureUrl(response.data.profile_picture_url);
      }
      setHasLoaded(true);
    } catch (error) {
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded]);

  const refreshProfilePicture = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProfilePicture();
      if (response.status === 200 && response.data.profile_picture_url) {
        setProfilePictureUrl(response.data.profile_picture_url);
      }
    } catch (error) {
      console.error("Failed to refresh profile picture:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfilePictureHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await deleteProfilePicture();
      if (response.status === 200) {
        setProfilePictureUrl(null);
      }
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfilePicture();
  }, [loadProfilePicture]);

  return (
    <ProfilePictureContext.Provider value={{
      profilePictureUrl,
      isLoading,
      refreshProfilePicture,
      deleteProfilePicture: deleteProfilePictureHandler,
    }}>
      {children}
    </ProfilePictureContext.Provider>
  );
};

export const useProfilePictureContext = () => {
  const context = useContext(ProfilePictureContext);
  if (context === undefined) {
    throw new Error('useProfilePictureContext must be used within a ProfilePictureProvider');
  }
  return context;
}; 