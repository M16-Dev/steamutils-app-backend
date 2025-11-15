import { Database } from "@db/sqlite";
import { ensureDir } from "@std/fs";

class DatabaseService {
  private db: Database;


  constructor(dbPath = "./data/steamutils.db") {
    const dir = dbPath.substring(0, dbPath.lastIndexOf("/"));
    ensureDir(dir);

    this.db = new Database(dbPath);
  }
}

export const db = new DatabaseService();
