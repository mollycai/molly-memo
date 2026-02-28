import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// 用户表
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  name: text("name"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 邮箱验证码表
export const emailVerifications = sqliteTable("email_verifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expire_at: integer("expire_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" })
    .notNull()
    .default(false),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});