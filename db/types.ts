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
  created_at: string;
}

