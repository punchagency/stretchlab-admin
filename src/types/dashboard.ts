export interface FilterOption {
  label: string;
  value: string;
}

export interface Flexologist {
  full_name: string;
  id: number;
}

export interface ChartFiltersResponse {
  data: {
    filters: FilterOption[];
    flexologists: Flexologist[];
    locations: string[];
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

export interface DashboardMetricsResponse {
  data: {
    balance_info: BalanceInfo;
    bookings_info: BookingsInfo;
  };
  status: string;
}

export interface FilterState {
  filterBy: string;
  duration: string;
  location: string;
  flexologist: string;
  dataset: string;
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
  location: string[];
  flexologist: string[];
  dataset: string[];
}

export interface ChartDataParams {
  duration: string;
  location?: string;
  flexologist?: number;
  dataset: string;
  filterBy: string;
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
}

export interface BusinessInfoResponse {
  data: BusinessInfo;
  status: string;
}

 