export interface Server {
  ip: string;
  port: number;
  password?: string | null;
}

export interface ConnectCodeRow {
  code: string;
  ip: string;
  port: number;
  password?: string | null;
  message_link: string;
  created_at: string;
}

