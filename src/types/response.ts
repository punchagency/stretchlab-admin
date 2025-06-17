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
    };
    status: number;
  };
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
  users: {
    clubready_username: string;
    clubready_password: string;
  };
}
