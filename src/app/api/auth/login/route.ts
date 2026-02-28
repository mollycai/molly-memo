import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { createDB } from "@/lib/db/client";
import { users } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcrypt-edge";
import { SignJWT } from "jose";
import { z } from "zod";

export const runtime = "edge";

const loginSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const { env } = getRequestContext();
    const db = createDB(env.DB);

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 400 }
      );
    }

    // Verify password
    const validPassword = compareSync(password, user.password_hash);

    if (!validPassword) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 400 }
      );
    }

    // Generate JWT
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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
