import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

// 初始化 OpenAI 客户端，配置为阿里云 DashScope 的兼容模式
// 注意：在 Edge Runtime 中，不要在模块顶层初始化 client，
// 而是应该在 handler 内部或使用 lazy initialization，以确保能获取到运行时的 env
const getClient = () => {
  return new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
};

export async function POST(req: NextRequest) {
  try {
    const client = getClient();
    const body = await req.json();
    const { image } = body as { image?: string };

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // 简单的 System Prompt，引导模型生成表情包文案
    const systemPrompt = `你是一个幽默大师和表情包制作专家。
请根据用户上传的图片，生成一句准确、简短、好笑、有梗的表情包配文。
要求：
1. 语言风格：网络用语、调侃、自嘲、犀利或可爱。
2. 字数限制：不超过 15 个字。
3. 只要输出文案本身，不要包含引号或其他解释性文字。
4. 如果图片内容不适合生成表情包（如涉及敏感、暴力等），请委婉拒绝。`;

    const response = await client.chat.completions.create({
      model: "qwen3.5-plus-2026-02-15", // 使用通义千问 VL 模型
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image, // 支持 Base64 或 URL
              },
            },
            {
              type: "text",
              text: "这张图怎么配文？",
            },
          ],
        },
      ],
      max_tokens: 50,
    });

    const caption = response.choices[0]?.message?.content?.trim() || "配文生成失败";

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("AI 生成失败:", error);
    return NextResponse.json(
      { error: "AI 生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
