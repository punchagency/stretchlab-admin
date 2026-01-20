export interface FilterOption {
  label: string;
  value: string;
}

export interface Flexologist {
  full_name: string;
  id: number;
}

import type { Location } from "./response";

export interface ChartFiltersResponse {
  data: {
    filters: FilterOption[];
    flexologists: string[];
    locations: Location[] | string[];
  };
  status: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  total?: number;
}

export interface ChartDataResponse {
  data: ChartDataPoint[];
  status: string;
}

export interface UserData {
  id: number;
  full_name: string;
  last_login: string;
  profile_picture_url: string | null;
  status: number;
  bookings: number;
  submitted_bookings: number;
  percentage_submitted_bookings: number;

}

export interface UserTableResponse {
  data: UserData[];
  status: string;
}

export interface BalanceInfo {
  month_transactions: number;
  status: string;
  total_available_balance: number;
}

export interface BookingsInfo {
  aggregation: number;
  bookings_in_last_month: number;
  bookings_in_month: number;
  business_name: string;
  neutral_trend: boolean;
  upwards_trend: boolean;
}

export interface SubscriptionInfo {
  average_number_of_locations_per_business: number;
  note_taking_active_count: number;
  number_of_subscribed_flexologists: number;
  number_of_subscribed_locations: number;
  rpa_active_count: number;
  unique_businesses_with_any_subscription: number;
}

export interface DashboardMetricsResponse {
  data: {
    balance_info: BalanceInfo;
    bookings_info: BookingsInfo;
    subscriptions_info: SubscriptionInfo;
  };
  status: string;
}

export interface FilterState {
  filterBy: string;
  duration: string;
  location: string;
  flexologist: string;
  dataset: string;
  filterMetric?: string;
  customRange?: {
    start: string;
    end: string;
  };

}


export interface DurationOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  filterBy: string[];
  duration: DurationOption[];
  location: (string | Location)[];
  flexologist: string[];
  dataset?: string[];
  filterMetric?: DurationOption[];
  dataset_analytics?: DurationOption[];
}

export interface ChartDataParams {
  duration: string;
  location?: string;
  flexologist?: string;
  dataset: string;
  filterBy: string;
  start_date?: string;
  end_date?: string;
  customRange?: {
    start: string;
    end: string;
  };
}

export interface MetricCardData {
  title: string;
  value: string;
  subtitle: string;
  buttonText?: string;
  buttonVariant: "primary" | "secondary" | "success" | "warning";
  showCurrency: boolean;
  tooltip?: string;
}

export interface BusinessData {
  id: number;
  business_id: number;
  buisness_flexologists_count: number;
  business_created_at: string;
  business_note_sub_status: string | null;
  business_rpa_sub_status: string | null;
  business_username: string;
}

export interface BusinessTableResponse {
  data: BusinessData[];
  status: string;
}

export interface BusinessFlexologistInfo {
  full_name: string;
  id: number;
  last_login: string;
  profile_picture_url: string | null;
  status: number;
}

export interface BusinessRpaSubDetails {
  currency: string;
  end_date: number;
  interval: string;
  price: number;
  quantity: number;
  start_date: number;
  status: string;
}

interface LocationSummary {
  location: string;
  total_bookings_in_location: number;
  total_submitted_by_location: number;
  flexologists: {
    name: string;
    total_bookings: number;
    total_submitted: number;
  }[];
}

export interface BusinessInfo {
  business_all_locations: string[] | null;
  business_created_at: string;
  business_flexologists_count: number;
  business_flexologists_info: BusinessFlexologistInfo[];
  business_note_sub_details: BusinessRpaSubDetails | null;
  business_note_sub_status: string | null;
  business_rpa_sub_details: BusinessRpaSubDetails | null;
  business_rpa_sub_status: string | null;
  business_selected_locations: string[] | null;
  business_username: string;
  locations_summary?: LocationSummary[];
}

export interface BusinessInfoResponse {
  data: BusinessInfo;
  status: string;
}

export interface ActivitiesData {
  notes_analysed_per_flexologist: Record<string, number>;
  notes_analysed_per_location: Record<string, number>;
  notes_submitted_with_app: number;
  total_analysed_bookings: number;
  notes_submitted_per_flexologist: Record<string, number>;
  notes_submitted_per_location: Record<string, number>;
  time_saved_minutes: number;
}

export interface ActivitiesResponse {
  data: ActivitiesData;
  status: string;
}

