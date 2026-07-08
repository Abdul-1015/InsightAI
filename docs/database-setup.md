# Database Setup Guide

## PostgreSQL Installation

### Windows (with Chocolatey)
```powershell
choco install postgresql
```

### Windows (manual)
1. Download the installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the superuser password you set during installation
4. Ensure the `bin` directory (e.g. `C:\Program Files\PostgreSQL\17\bin`) is in your PATH

### macOS
```bash
brew install postgresql@17
brew services start postgresql@17
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Database Creation

Connect to PostgreSQL and create the application database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE ai_analysis_tool;
\q
```

## Required Environment Variables

Add the following to your `.env` file:

```
DATABASE_URL=postgres://user:password@localhost:5432/ai_analysis_tool
```

Replace `user` and `password` with your PostgreSQL credentials.

You can copy `.env.example` to `.env` and fill in the values.

## Connection Verification

Run the following command to verify the database connection:

```bash
npx tsx -e "import { verifyConnection } from './src/lib/db/connection'; await verifyConnection(); console.log('OK')"
```

Or start the dev server and watch the server logs:

```bash
npm run dev
```

If `DATABASE_URL` is configured and PostgreSQL is running, you will see:

```
[db] Connected to PostgreSQL successfully
```

If `DATABASE_URL` is missing, the server will warn:

```
[db] DATABASE_URL is not configured. Database features disabled until it is set.
```

This is expected during local development when the database is not yet installed.

## Drizzle ORM

This project uses Drizzle ORM with the `postgres` driver.

- Schema definitions: `src/lib/db/schema.ts`
- Database client: `src/lib/db/connection.ts`
- Barrel exports: `src/lib/db/index.ts`
- Migrations config: `drizzle.config.ts`

Run migrations:

```bash
npm run db:generate   # generate migration files
npm run db:push       # push schema changes to DB
npm run db:studio     # open Drizzle Studio
```
