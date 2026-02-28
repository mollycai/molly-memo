import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { createDB } from "@/lib/db/client";
import { users, emailVerifications } from "@drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashSync } from "bcrypt-edge";
import { SignJWT } from "jose";
import { z } from "zod";

export const runtime = "edge";

const registerSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
  password: z.string().min(6, "密码长度至少为 6 位"),
  code: z.string().length(6, "验证码必须是 6 位数字"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, code, name } = result.data;
    const { env } = getRequestContext();
    const db = createDB(env.DB);

    // Verify code
    const verification = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, code),
          eq(emailVerifications.used, false),
          gt(emailVerifications.expire_at, new Date())
        )
      )
      .orderBy(emailVerifications.created_at) // Get the latest valid one? No, verify specifically
      .limit(1)
      .then((rows) => rows[0]);

    if (!verification) {
      return NextResponse.json(
        { error: "验证码无效或已过期" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (existingUser) {
      return NextResponse.json(
        { error: "用户已存在" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = hashSync(password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password_hash: passwordHash,
        name: name || email.split("@")[0],
      })
      .returning()
      .then((rows) => rows[0]);

    // Mark verification as used
    await db
      .update(emailVerifications)
      .set({ used: true })
      .where(eq(emailVerifications.id, verification.id));

    // Generate JWT
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({
      id: newUser.id,
      email: newUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: `服务器内部错误` },
      { status: 500 }
    );
  }
}
