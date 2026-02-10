import { Database } from "@db/sqlite";

export class GuildTokensModel {
  constructor(private db: Database) {
    this.db.exec(`CREATE TABLE IF NOT EXISTS guild_tokens (
      token TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_guild_tokens_guild 
        ON guild_tokens(guild_id)
      `);
  }

  create(guildId: string): string {
    const token = crypto.randomUUID().replace(/-/g, "");
    const stmt = this.db.prepare(
      "INSERT INTO guild_tokens (token, guild_id) VALUES (?, ?)",
    );
    stmt.run(token, guildId);
    return token;
  }

  delete(token: string): boolean {
    const stmt = this.db.prepare("DELETE FROM guild_tokens WHERE token = ?");
    const changes = stmt.run(token);
    return changes > 0;
  }

  deleteByGuild(guildId: string): boolean {
    const stmt = this.db.prepare("DELETE FROM guild_tokens WHERE guild_id = ?");
    const changes = stmt.run(guildId);
    return changes > 0;
  }

  getByToken(token: string): string | null {
    const stmt = this.db.prepare(
      "SELECT guild_id FROM guild_tokens WHERE token = ? LIMIT 1",
    );
    const result = stmt.value<[string]>(token);
    return result?.[0] ?? null;
  }

  getByGuild(guildId: string): string[] {
    const stmt = this.db.prepare(
      "SELECT token FROM guild_tokens WHERE guild_id = ?",
    );
    const rows = stmt.all<{ token: string }>(guildId);
    return rows.map((r) => r.token);
  }

  countByGuild(guildId: string): number {
    const stmt = this.db.prepare(
      "SELECT COUNT(*) FROM guild_tokens WHERE guild_id = ?",
    );
    const result = stmt.value<[number]>(guildId);
    return result?.[0] ?? 0;
  }

  exists(token: string): boolean {
    const res = this.db.prepare("SELECT 1 FROM guild_tokens WHERE token = ?").get(token);
    return !!res;
  }
}
