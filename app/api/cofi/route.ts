// app/api/cofi/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

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

  const data = await res.json();
  return NextResponse.json(data);
}