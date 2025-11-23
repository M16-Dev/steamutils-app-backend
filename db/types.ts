export interface Server {
  ip: string;
  port: number;
  password?: string | null;
}

export interface serverCodeRow {
  code: string;
  guild_id: string;
  ip: string;
  port: number;
  password?: string | null;
  created_at: string;
}
