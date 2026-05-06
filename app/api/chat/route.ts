import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLICSUPABASE_SERVICE_KEY!
);

// 単語抽出
function extractWords(text: string) {
  return text
    .replace(/[^\wぁ-んァ-ンー一-龠]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

// ローン計算
function calcLoan(amount: number, rate: number, years: number) {
  const r = rate / 100 / 12;
  const n = years * 12;

  const monthly =
    (amount * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  return Math.round(monthly);
}

// Dify呼び出し
async function callDify(message: string) {
  const res = await fetch("https://api.dify.ai/v1/chat-messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: {},
      query: message,
      response_mode: "blocking",
      user: "test-user",
    }),
  });

  const data = await res.json();
  return data.answer || "すみません、うまく回答できませんでした。";
}

export async function POST(req: Request) {
  const { chatId, message } = await req.json();

  const userWords = extractWords(message);

  // ユーザー保存
  await supabase.from("chat_logs").insert({
    chat_id: chatId,
    role: "user",
    words: userWords,
  });

  let reply = "";

  // 🔥 ローン判定（ここが機能追加）
  if (message.includes("ローン")) {
    reply =
      "ローン計算ですね！「3000万 1.2% 35年」のように入力してください。";
  }

  // 🔥 数値入力パターン
  else if (/\d+/.test(message)) {
    const nums = message.match(/\d+(\.\d+)?/g);

    if (nums && nums.length >= 3) {
      const amount = Number(nums[0]) * 10000;
      const rate = Number(nums[1]);
      const years = Number(nums[2]);

      const result = calcLoan(amount, rate, years);

      reply = `毎月の返済額は約 ${result.toLocaleString()} 円です！`;
    } else {
      reply = "数値の形式が正しくありません（例: 3000万 1.2 35）";
    }
  }

  // 🔥 それ以外 → Dify
  else {
    reply = await callDify(message);
  }

  const botWords = extractWords(reply);

  // Bot保存
  await supabase.from("chat_logs").insert({
    chat_id: chatId,
    role: "bot",
    words: botWords,
  });

  return NextResponse.json({ reply });
}