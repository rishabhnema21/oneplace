import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg"
import * as schema from "./schema"
import { ENV } from "../config/env"

if (!ENV.DB_URL) {
    throw new Error("DB_URL is not set in Environmental Variables")
}

const pool = new Pool({connectionString: ENV.DB_URL});

pool.on("connect", () => {
    console.log("Database connected successfully");
})

pool.on("error", (err) => {
    console.log("Database connection error: ",err);
})

export const db = drizzle(pool, { schema });

// A connection pool is something like a cache of connections of db, that are kept open and reused. opening and closing of the db is slow, so instead of creating new connection for every request, we just use the previously existing connection so that database connection limit could be saved.