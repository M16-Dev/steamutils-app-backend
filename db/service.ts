import { Database } from "@db/sqlite";
import { ensureDirSync } from "@std/fs";
import { ServerCodesModel } from "./models/serverCodes.ts";
import { ConnectionsModel } from "./models/connections.ts";
import { GuildTokensModel } from "./models/guildTokens.ts";

class DatabaseService {
  private db: Database;

  public serverCodes: ServerCodesModel;
  public connections: ConnectionsModel;
  public guildTokens: GuildTokensModel;

  constructor(dbPath = "./data/steamutils.db") {
    const dir = dbPath.substring(0, dbPath.lastIndexOf("/"));
    ensureDirSync(dir);

    this.db = new Database(dbPath);

    this.serverCodes = new ServerCodesModel(this.db);
    this.connections = new ConnectionsModel(this.db);
    this.guildTokens = new GuildTokensModel(this.db);

    this.seedData();
  }

  private seedData() {
    this.serverCodes.seedData();
  }
}

export const db = new DatabaseService();
