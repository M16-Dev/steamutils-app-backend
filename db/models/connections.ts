import { Database } from "@db/sqlite";
import { ConnectionRow } from "../types.ts";

export class ConnectionsModel {
  constructor(private db: Database) {
    this.db.exec(`CREATE TABLE IF NOT EXISTS connections (
      discord_id TEXT NOT NULL,
      steam_id TEXT NOT NULL,
      guild_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (discord_id, guild_id)
    )`);

    this.db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_connections_steam_guild 
      ON connections(steam_id, guild_id)
    `);
  }

  create(discordId: string, steamId: string, guildId: string): boolean {
    const stmt = this.db.prepare(
      "INSERT OR IGNORE INTO connections (discord_id, steam_id, guild_id) VALUES (?, ?, ?)",
    );
    const changes = stmt.run(discordId, steamId, guildId);
    return changes > 0;
  }

  delete(discordId: string, steamId: string, guildId: string): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM connections WHERE discord_id = ? AND steam_id = ? AND guild_id = ?",
    );
    const changes = stmt.run(discordId, steamId, guildId);
    return changes > 0;
  }

  deleteBySteamId(steamId: string): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM connections WHERE steam_id = ?",
    );
    const changes = stmt.run(steamId);
    return changes > 0;
  }

  deleteByDiscordId(discordId: string): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM connections WHERE discord_id = ?",
    );
    const changes = stmt.run(discordId);
    return changes > 0;
  }

  deleteByGuildId(guildId: string): boolean {
    const stmt = this.db.prepare(
      "DELETE FROM connections WHERE guild_id = ?",
    );
    const changes = stmt.run(guildId);
    return changes > 0;
  }

  getConnectionsByDiscordId(discordId: string): ConnectionRow[] {
    const stmt = this.db.prepare(
      "SELECT discord_id, steam_id, guild_id, created_at FROM connections WHERE discord_id = ?",
    );
    return stmt.all<ConnectionRow>(discordId);
  }

  getDiscordId(steamId: string, guildId: string): string | null {
    const stmt = this.db.prepare(
      "SELECT discord_id FROM connections WHERE steam_id = ? AND guild_id = ?",
    );
    const res = stmt.value<[string]>(steamId, guildId);
    return res?.[0] ?? null;
  }

  getSteamId(discordId: string, guildId: string): string | null {
    const stmt = this.db.prepare(
      "SELECT steam_id FROM connections WHERE discord_id = ? AND guild_id = ?",
    );
    const res = stmt.value<[string]>(discordId, guildId);
    return res?.[0] ?? null;
  }
}
