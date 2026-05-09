import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =========================
// 単語抽出
// =========================

function extractWords(text: string) {
  return text
    .replace(/[^\wぁ-んァ-ンー一-龠]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

// =========================
// ローン計算
// =========================

function calcLoan(
  amount: number,
  rate: number,
  years: number
) {
  const r = rate / 100 / 12;

  const n = years * 12;

  const monthly =
    (amount * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  return Math.round(monthly);
}

// =========================
// Dify呼び出し
// =========================

async function callDify(message: string) {
  const res = await fetch(
    "https://api.dify.ai/v1/chat-messages",
    {
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
    }
  );

  const data = await res.json();

  return (
    data.answer ||
    "すみません、うまく回答できませんでした。"
  );
}

// =========================
// POST
// =========================

export async function POST(req: Request) {
  const { chatId, message } = await req.json();

  let reply = "";

  // =========================
  // ローン判定
  // =========================

  if (message.includes("ローン")) {
    reply =
      "ローン計算ですね！「3000 1.2 35」のように入力してください。\n\n（借入額 金利 年数）";
  }

  // =========================
  // ローン数値入力
  // =========================

  else if (/\d+/.test(message)) {
    const nums = message.match(/\d+(\.\d+)?/g);

    if (nums && nums.length >= 3) {
      const amount = Number(nums[0]) * 10000;

      const rate = Number(nums[1]);

      const years = Number(nums[2]);

      const result = calcLoan(
        amount,
        rate,
        years
      );

      reply = `
🏠 ローン計算結果

借入額：
${amount.toLocaleString()} 円

金利：
${rate} %

返済年数：
${years} 年

毎月の返済額：
約 ${result.toLocaleString()} 円
`;
    } else {
      reply =
        "数値の形式が正しくありません。\n\n例：3000 1.2 35";
    }
  }

  // =========================
  // Dify
  // =========================

  else {
    reply = await callDify(message);
  }

  // =========================
  // 単語抽出
  // =========================

  const userWords = extractWords(message);

  const botWords = extractWords(reply);

  // =========================
  // Supabase保存
  // =========================

  await supabase.from("chat_logs").insert({
    chat_id: chatId,

    user_message: message,

    bot_message: reply,

    user_words: userWords,

    bot_words: botWords,
  });

  // =========================
  // 返却
  // =========================

  return NextResponse.json({ reply });
}