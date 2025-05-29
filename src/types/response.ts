import type { AxiosResponse } from "axios";

export interface DefaultResponse extends AxiosResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  response: {
    data: {
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
  users: {
    clubready_username: string;
    clubready_password: string;
  };
}
