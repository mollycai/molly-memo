import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { createDB } from "@/lib/db/client";
import { emailVerifications } from "@drizzle/schema";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "edge";

const sendCodeSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
});

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = sendCodeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const { env } = getRequestContext();
    const db = createDB(env.DB);

    // Generate code
    const code = generateCode();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save code to DB
    await db.insert(emailVerifications).values({
      email,
      code,
      expire_at: expireAt,
      used: false,
    });

    // Send email using Resend
    const resend = new Resend(env.RESEND_API_KEY);
    
    const { error } = await resend.emails.send({
      from: "Molly Meme <onboarding@resend.dev>", // TODO: Replace with your domain
      to: email,
      subject: "您的验证码",
      html: `<p>您的验证码是：<strong>${code}</strong></p><p>该验证码将在 10 分钟后过期。</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: `发送验证码失败: ${error.message || error.name}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "验证码已发送" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: `服务器内部错误` },
      { status: 500 }
    );
  }
}
