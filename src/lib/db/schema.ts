import { z } from "zod";

export const sendCodeSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
});

export const registerSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
  password: z.string().min(6, "密码长度至少为 6 位"),
  code: z.string().length(6, "验证码必须是 6 位数字"),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});
