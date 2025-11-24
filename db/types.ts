export interface Server {
  ip: string;
  port: number;
  password?: string | null;
}

export interface ServerCodeRow {
  code: string;
  guild_id: string;
  ip: string;
  port: number;
  password?: string | null;
  created_at: string;
}

export interface ConnectionRow {
  discord_id: string;
  steam_id: string;
  guild_id: string;
  created_at: string;
}
