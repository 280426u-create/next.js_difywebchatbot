import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const difyRes = await fetch(
      "https://api.dify.ai/v1/chat-messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: "streaming",
          user: "user123",
        }),
      }
    );

    // ★★★ JSON ではなく raw text を確認するためのデバッグ ★★★
    const text = await difyRes.text();
    console.log("Dify raw response:", text);

    return NextResponse.json({ raw: text });
  } catch (e: unknown) {
    // ★★★ unknown を Error として扱えるようにする ★★★
    if (e instanceof Error) {
      console.error("Error in /api/cofi:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      console.error("Unknown error:", e);
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}