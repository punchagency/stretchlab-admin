import { useContext } from "react";
import { ProfilePictureContext } from "@/contexts/ProfilePictureContext";

export const useProfilePictureContext = () => {
    const context = useContext(ProfilePictureContext);
    if (context === undefined) {
        throw new Error('useProfilePictureContext must be used within a ProfilePictureProvider');
    }
    return context;
};
