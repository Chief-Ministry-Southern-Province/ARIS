export interface NotificationPayload {
  title?: string;
  message?: string;
  type?: string;
  accident_id?: number;
  accident_case_id?: number;
  approval_id?: number;
  document_type?: string;
  reference_number?: string | null;
  revision?: number;
  step?: number;
  url?: string;
}

export interface AppNotification {
  id: string | number;
  type: string;
  data: NotificationPayload;
  title?: string;
  message?: string;
  action_url?: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPage {
  data: AppNotification[];
  current_page: number;
  last_page: number;
  total: number;
}
