import { createDB } from "./db/client";
import { users } from "./db/schema";

export default {
  async fetch(req: Request, env: Env) {
    const db = createDB(env.DB);

    const result = await db.select().from(users);

    return Response.json(result);
  },
};