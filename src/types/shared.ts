export type SvgIconName =
  | "menu"
  | "lock"
  | "mail"
  | "eye"
  | "phone"
  | "angle-left"
  | "send"
  | "microphone"
  | "stop"
  | "warning"
  | "check-circle"
  | "dashboard"
  | "analytics"
  | "note"
  | "rpa"
  | "email-send"
  | "search"
  | "filter"
  | "settings"
  | "robot"
  | "fax"
  | "cancel"
  | "logout"
  | "edit"
  | "bell"
  | "billing"
  | "trash"
  | "users";

export type RobotHistoryType = {
  id: number;
  robot_config_id: number;
  status: string;
  created_at: string;
};

export type BookingType = {
  appointment_date: string;
  booked_on_date: string;
  booking_id: string;
  client_name: string;
  first_timer: string;
  flexologist_name: string;
  id: string | number | undefined;
  key_note: string;
  location: string;
  member_rep_name: string;
  missed_sale_follow_up_rubric: string;
  note_analysis_improvements: string;
  note_analysis_progressive_moments: string;
  note_oppurtunities: string;
  note_score: string;
  note_summary: string;
  pre_visit_preparation_rubric: string;
  run_date: string;
  session_notes_rubric: string;
  status: string;
  unpaid_booking: string;
  workout_type: string;
};
