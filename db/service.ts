import { Database } from "@db/sqlite";
import { ensureDir } from "@std/fs";
import { ConnectCodesModel } from "./models/connectCodes.ts";

class DatabaseService {
  private db: Database;

  public connectCodes: ConnectCodesModel;

  constructor(dbPath = "./data/steamutils.db") {
    const dir = dbPath.substring(0, dbPath.lastIndexOf("/"));
    ensureDir(dir);

    this.db = new Database(dbPath);

    this.connectCodes = new ConnectCodesModel(this.db);

    this.seedData();
  }

  private seedData() {
    this.connectCodes.seedData();
  }
}

export const db = new DatabaseService();
