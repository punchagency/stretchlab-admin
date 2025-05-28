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
