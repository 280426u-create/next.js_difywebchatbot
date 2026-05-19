// app/api/cofi/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {

  // フロントから送られてきたデータ取得
  const body = await req.json();

  // message を取得
  const query = body?.message || "";

  // Dify APIへ送信
  const res = await fetch(process.env.DIFY_API_URL!, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
    },

    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: "blocking",
      user: "user-001",
    }),
  });

  // エラー確認
  if (!res.ok) {

    const errText = await res.text();

    console.log("Dify Error:", errText);

    return NextResponse.json(
      { error: errText },
      { status: 500 }
    );
  }

  // 正常レスポンス
  const data = await res.json();

  return NextResponse.json(data);
}