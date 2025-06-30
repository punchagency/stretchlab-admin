// export type SettingsFormData = {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phoneNumber: string;
//   twoFactorAuth: string;
//   language: string;
//   timeZone: string;
// };

// export type SettingsToggles = {
//   notifications: boolean;
//   accountVisibility: boolean;
//   deleteAccount: boolean;
// };

// export type SelectOption = {
//   value: string;
//   label: string;
// }; 



export type ProfileFormData = {
  username: string;
  email: string;
};

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TwoFactorSettings = {
  emailEnabled: boolean;
  status: "enabled" | "disabled" | "pending";
};

export type TwoFactorModalState = {
  isOpen: boolean;
  mode: "enable" | "disable" | "resend" | null;
};