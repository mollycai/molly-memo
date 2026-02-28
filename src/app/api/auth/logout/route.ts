import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  // Since we are using client-side token storage (Zustand),
  // the server-side logout is mainly for future expansion (e.g., clearing HttpOnly cookies).
  // Currently, we just return a success message.
  
  return NextResponse.json({ message: "退出登录成功" });
}
