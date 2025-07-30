import type { AxiosResponse } from "axios";
import type { BillingInfo } from ".";

export interface DefaultResponse extends AxiosResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  response: {
    data: {
      payment_id?: boolean;
      payment_info?: BillingInfo;
      message: string;
      error?: string;
    };
    status: number;
  };
}

export interface User {
  email: string;
  id: number;
  is_verified: boolean;
  role_id: number;
  username: string;
  is_clubready_verified: boolean;
}

export interface LoginResponse {
  message: string;
  requires_2fa?: boolean;
  status: string;
  token?: string; 
  user: User;
}

export interface RobotConfig {
  id: number;
  name: string;
  active: boolean;
  number_of_locations: number;
  created_at: Date;
  updated_at: Date;
  run_time: string;
  unlogged_booking: boolean;
  status: string;
  selected_locations: string[];
  locations: string[];
  users: {
    clubready_username: string;
    clubready_password: string;
  };
}
