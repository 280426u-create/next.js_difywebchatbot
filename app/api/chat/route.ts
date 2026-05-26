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
// ペルソナ判定
// =========================
function detectPersona(message: string) {
  const msg = message;

  // 50代夫婦
  if (
    /50代/.test(msg) ||
    /夫婦/.test(msg) ||
    /二人暮らし/.test(msg) ||
    /800万円|900万円/.test(msg)
  ) {
    return "P1";
  }

  // 30代女性
  if (
    /30代/.test(msg) ||
    /女性/.test(msg) ||
    /一人暮らし/.test(msg) ||
    /450万円|500万円|550万円/.test(msg)
  ) {
    return "P2";
  }

  // 40代ファミリー
  if (
    /40代/.test(msg) ||
    /子供/.test(msg) ||
    /1000万円/.test(msg)
  ) {
    return "P3";
  }

  return null;
}

// =========================
// ローン計算
// =========================
function calcLoan(amount: number, rate: number, years: number) {
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
  return data.answer || "すみません、うまく回答できませんでした。";
}

// =========================
// POST
// =========================
export async function POST(req: Request) {
  const {
  chatId,
  message,
  forceReply,
} = await req.json();
  let reply = forceReply || "";

  // =========================
  // ① ペルソナ判定
  // =========================
  const persona = detectPersona(message);

  if (persona === "P1") {
    reply =
      "50代ご夫婦向けのローンシミュレーションですね！\n頭金はどのくらいを予定されていますか？";
  } else if (persona === "P2") {
    reply =
      "30代女性の方向けのローン相談ですね！\n頭金の予定額を教えていただけますか？";
  } else if (persona === "P3") {
    reply =
      "40代ファミリー向けのローンシミュレーションですね！\n毎月の返済希望額はありますか？";
  }

  // =========================
  // ペルソナに該当 → ここで返す
  // =========================
  if (reply !== "") {
  const { data, error } = await supabase
    .from("chat_logs")
    .insert({
      chat_id: chatId,
      user_message: message,
      bot_message: reply,
      user_words: extractWords(message),
      bot_words: extractWords(reply),
    });

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);

  return NextResponse.json({ reply });
}

// =========================
// ② 眺望画像
// =========================

if (
  message.includes("眺望") ||
  message.includes("景色") ||
  message.includes("外観")
) {
  reply = `
# 鷹匠マンション 14階の眺望

![view](/view14.jpg)
`;
}

  // =========================
  // ② 数値入力 → ローン計算
  // =========================
  if (
  reply === "" &&
  /^\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+$/.test(message)
) {
    const nums = message.match(/\d+(\.\d+)?/g);

    if (nums && nums.length >= 3) {
      const amount = Number(nums[0]) * 10000;
      const rate = Number(nums[1]);
      const years = Number(nums[2]);

      const result = calcLoan(amount, rate, years);

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
        "数値の形式が正しくありません。\n例：3000 1.2 35";
    }
  }

  // =========================
  // ③ ローンでも数値でもない → Dify
  // =========================
  if (reply === "") {
    reply = await callDify(message);
    console.log(reply);
  }

  // =========================
// ④ Supabase保存
// =========================
const { data, error } = await supabase
  .from("chat_logs")
  .insert({
    chat_id: chatId || "test-user",
    user_message: message,
    bot_message: reply,
    user_words: extractWords(message),
    bot_words: extractWords(reply),
  })
  .select();

console.log("INSERT DATA:", data);
console.log("INSERT ERROR:", error);

  // =========================
  // 返却
  // =========================
  return NextResponse.json({ reply });
}

