import type { Database } from "@db/sqlite";
import type { Server } from "../types.ts";
import { customAlphabet } from "@sitnik/nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export class ServerCodesModel {
  constructor(private db: Database) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS server_codes (
        code TEXT PRIMARY KEY,
        guild_id TEXT NOT NULL,
        ip TEXT NOT NULL,
        port INTEGER NOT NULL,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(guild_id, ip, port)
      )
    `);
  }

  seedData() {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM server_codes");
    const res = stmt.value<[number]>();
    const [count] = res ?? [0];

    if (count === 0) {
      this.db.exec(
        `INSERT INTO server_codes (code, guild_id, ip, port, password) VALUES 
         ('AAAAAAAA', '1234', '192.168.0.1', 27015, NULL),
         ('BBBBBBBB', '4312', '192.168.0.2', 27016, 'xddos'),
         ('CCCCCCCC', '5476', '192.168.0.1', 27015, NULL)`,
      );
      console.log("✅ Connect codes seeded");
    }
  }

  getServerByCode(code: string): Server | null {
    const stmt = this.db.prepare(
      "SELECT ip, port, password FROM server_codes WHERE code = ?",
    );
    const res = stmt.get<Server>(code);
    return res ?? null;
  }

  getCodeByServer(guildId: string, ip: string, port: number): string | null {
    const stmt = this.db.prepare(
      "SELECT code FROM server_codes WHERE guild_id = ? AND ip = ? AND port = ?",
    );
    const res = stmt.value<[string]>(guildId, ip, port);
    return res?.[0] ?? null;
  }

  getAllByGuild(guildId: string): { code: string; ip: string; port: number; password: string | null }[] {
    const stmt = this.db.prepare(
      "SELECT code, ip, port, password FROM server_codes WHERE guild_id = ?",
    );
    const codes = stmt.all<{ code: string; ip: string; port: number; password: string | null }>(guildId);
    return codes;
  }

  getGuildCodesCount(guildId: string): number {
    const stmt = this.db.prepare(
      "SELECT COUNT(*) as count FROM server_codes WHERE guild_id = ?",
    );
    const res = stmt.value<[number]>(guildId);
    return res ? res[0] : 0;
  }

  updatePassword(code: string, password: string | null): boolean {
    const stmt = this.db.prepare(
      "UPDATE server_codes SET password = ? WHERE code = ?",
    );
    const changes = stmt.run(password, code);
    return changes > 0;
  }

  create(guildId: string, ip: string, port: number, password: string | null): string {
    const code = this.getCodeByServer(guildId, ip, port);
    if (code) {
      this.updatePassword(code, password);
      return code;
    }

    const newCode = nanoid();
    const insertStmt = this.db.prepare(
      "INSERT INTO server_codes (code, guild_id, ip, port, password) VALUES (?, ?, ?, ?, ?)",
    );

    try {
      insertStmt.run(newCode, guildId, ip, port, password);
      return newCode;
    } catch (_) {
      throw new Error("Failed to generate unique code.");
    }
  }

  delete(code: string): boolean {
    const stmt = this.db.prepare("DELETE FROM server_codes WHERE code = ?");
    const changes = stmt.run(code);
    return changes > 0;
  }
}
