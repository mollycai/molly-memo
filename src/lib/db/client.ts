import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDB(d1: CloudflareEnv["DB"]) {
  return drizzle(d1, { schema });
}