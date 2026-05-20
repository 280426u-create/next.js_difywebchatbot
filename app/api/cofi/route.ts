import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // --- Dify API 呼び出し ---
    const difyRes = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`, // ★APIキー
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: "blocking",
        user: "user123",
      }),
    });

    const json = await difyRes.json();
    console.log("Dify JSON response:", json);

    // 401 / APIキー無効のとき
    if (json?.status === 401 || json?.code === "unauthorized") {
      return NextResponse.json(
        {
          answer: "❌ Dify APIキーが無効です。\nNEXT_PUBLIC_DIFY_API_KEY を確認してください。",
          raw: json,
        },
        { status: 401 }
      );
    }

    // 正常返却
    return NextResponse.json({
      answer: json.answer ?? "回答が取得できませんでした。",
      raw: json,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error in /api/cofi:", e.message);
      return NextResponse.json(
        { error: e.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", e);
      return NextResponse.json(
        { error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}