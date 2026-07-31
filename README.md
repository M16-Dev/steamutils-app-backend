# SteamUtils Backend
**REST API** written in **TypeScript** + **Deno** + **Hono** for SteamUtils service.

> [!NOTE]
> SteamUtils is a service to integrate Discord and Steam, aimed primarily at owners of Steam-based dedicated servers (e.g. Garry's Mod, Rust, etc.) and offering a set of extremely useful features for their Discord communities.

Learn more on [**Project's Website**](https://steamutils.app)

Or check [**API docs**](https://api.steamutils.app/v1/docs) to extend integration 

## Features
- API for external developers
- RBAC (Role Based Access Control)
- Rate Limiting
- Cache
- Edge/Serverless-ready architecture
- Cloudflare integration
- Steam authentication
- Sensitive data encryption
- OpenAPI and ScalarUI
- DrizzleORM

## Project Structure
```text
├── app.ts                    # Hono app setup, middleware, and route registration
├── main.ts                   # Application entry point
├── config.ts                 # Configuration validator
├── config.json               # Config file for some properties
├── deno.jsonc                # Deno config
├── drizzle.config.ts         # Drizzle ORM / migrations configuration
├── .env.example              # Example environment variables
├── routes/                   # Directory for API routes and endpoints
├── middlewares/              # Directory for middlewares
├── db/                       # Data access layer
│   ├── index.ts              # DB initialization/exports
│   └── schema/               # Database schema definitions
├── utils/                    # Shared utilities and integrations
│   ├── cache.ts              # Cache helpers
│   ├── crypto.ts             # Cryptographic utilities
│   ├── discordLogger.ts      # Discord logging (through webhooks)
│   ├── fetch.ts              # HTTP fetch helpers/wrappers
│   ├── openapi.ts            # OpenAPI setup/helpers
│   ├── steamAuth.ts          # Steam authentication logic
│   └── templates.ts          # Shared templates/helpers
├── types/                    # TypeScript type definitions
│   └── hono.ts               # Hono context/type extensions
└── scripts/                  # Dev scripts and Git hooks
    ├── install-hooks.ts      # Hook installation script
    └── pre-commit            # Pre-commit hook
```

## Quick Start For Team Members
> [!IMPORTANT]
> Before making any commits, run `deno task install-hooks`, which enables checking lint, formatting and runs all tests.\
> Before every commit, you should run `deno task format` and `deno task check`, and fix any potential issues to successfully pass precommit check.

### Run project
> [!NOTE]
> Before running the project, make sure there is `.env` file filled like [.env.example](.env.example)

- **Running project in development mode (with --watch flag)**
  ```console
  deno task dev
  ```
- **Running project**
  ```console
  deno task start
  ```

### Working with database
- **Updating database**
  ```console
  deno task db:push
  ```
- **Opening database web interface**
  ```console
  deno task db:studio
  ```

## Hosting on edge/serverless environment
Go to `.env` file:
- Set `RUNTIME_ENV` env to `deno-deploy` or `cloudflare-workers`, depending on the environment
- Set `DB_URL` and `DB_TOKEN` for SQLite database, e.g. [Turso](https://turso.tech/)
- Set `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN` for rate limiting

## Author
Built and maintained by [Kameq](https://github.com/kameqdev)

## License
This repository is intended solely for portfolio and recruitment evaluation. Unauthorized reproduction, modification, or deployment is strictly prohibited.
