import type { Database } from "@db/sqlite";
import type { Server, ConnectCodeRow } from "../types.ts";
import { customAlphabet } from "@sitnik/nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export class ConnectCodesModel {
  constructor(private db: Database) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS connect_codes (
        code TEXT PRIMARY KEY,
        ip TEXT NOT NULL,
        port INTEGER NOT NULL,
        password TEXT,
        message_link TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  seedData() {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM connect_codes");
    const res = stmt.value<[number]>();
    const [count] = res ?? [0];

    if (count === 0) {
      this.db.exec(
        `INSERT INTO connect_codes (code, ip, port, password, message_link) VALUES 
         ('AAAAAAAA', '192.168.0.1', 27015, NULL, 'https://discord.com/channels/123/456/789'),
         ('BBBBBBBB', '192.168.0.2', 27016, 'xddos', 'https://discord.com/channels/1111/2222/3333')`
      );
      console.log("✅ Database seeded with sample data");
    }
  }

  getServerByCode(code: string): Server | null {
    const stmt = this.db.prepare(
      "SELECT ip, port, password FROM connect_codes WHERE code = ?"
    );
    const res = stmt.get<Server>(code);
    return res ?? null;
  }

  getFullByCode(code: string): ConnectCodeRow | null {
    const stmt = this.db.prepare("SELECT * FROM connect_codes WHERE code = ?");
    const res = stmt.get<ConnectCodeRow>(code);
    return res ?? null;
  }

  create(
    ip: string,
    port: number,
    message_link: string,
    password?: string
  ): string | null {
    const code = nanoid();

    const checkStmt = this.db.prepare(
      "SELECT 1 FROM connect_codes WHERE code = ?"
    );
    const found = checkStmt.value<[number]>(code);
    if (found) return null;

    const insertStmt = this.db.prepare(
      "INSERT INTO connect_codes (code, ip, port, password, message_link) VALUES (?, ?, ?, ?, ?)"
    );
    insertStmt.run(code, ip, port, password ?? null, message_link);

    return code;
  }

  delete(code: string): boolean {
    const stmt = this.db.prepare("DELETE FROM connect_codes WHERE code = ?");
    stmt.run(code);
    const changes = this.db.changes;
    return changes > 0;
  }

  getAllLinks(): string[] {
    const stmt = this.db.prepare("SELECT message_link FROM connect_codes");
    const rows = stmt.all<[string]>();
    return rows.map((row) => row[0]);
  }

  getAll(): ConnectCodeRow[] {
    const stmt = this.db.prepare(
      "SELECT * FROM connect_codes ORDER BY created_at DESC"
    );
    const rows = stmt.all<ConnectCodeRow>();
    return rows;
  }
}
