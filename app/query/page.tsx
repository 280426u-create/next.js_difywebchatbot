"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Chat = {
  role: string;
  text: string;
};

type LoanData = {
  plan?: string;
  price?: number;
  downPayment?: number;
  years?: number;
  rate?: number;
};

export default function QueryPage() {
  const [msg, setMsg] = useState("");

  const [chat, setChat] = useState<Chat[]>([
    {
      role: "bot",
      text:
        "こんにちは！🏠\n住宅ローンシミュレーションを開始します。\n\nまず、201・202・203・204からお選びください。",
    },
  ]);

  const [visible, setVisible] = useState(false);

  // 現在の質問ステップ
  const [step, setStep] = useState(0);

  // ローン情報
  const [loanData, setLoanData] = useState<LoanData>({});

  useEffect(() => {
    setVisible(true);
  }, []);

  // 毎月返済額計算
  function calculateLoan(
    principal: number,
    annualRate: number,
    years: number
  ) {
    const monthlyRate = annualRate / 100 / 12;

    const months = years * 12;

    const payment =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment);
  }

  async function send() {
    if (!msg) return;

    const userMsg = msg;

    setChat((prev) => [
      ...prev,
      { role: "user", text: userMsg },
    ]);

    setMsg("");

    // STEP 0: プラン
    if (step === 0) {
      setLoanData((prev) => ({
        ...prev,
        plan: userMsg,
      }));

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "購入予定価格を教えてください。\n例：3500万円",
        },
      ]);

      setStep(1);
      return;
    }

    // STEP 1: 物件価格
    if (step === 1) {
      const price =
        Number(userMsg.replace(/[^0-9]/g, "")) *
        10000;

      setLoanData((prev) => ({
        ...prev,
        price,
      }));

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "頭金はいくらですか？\n例：500万円\n※なしの場合は0",
        },
      ]);

      setStep(2);
      return;
    }

    // STEP 2: 頭金
    if (step === 2) {
      const downPayment =
        Number(userMsg.replace(/[^0-9]/g, "")) *
        10000;

      setLoanData((prev) => ({
        ...prev,
        downPayment,
      }));

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "返済期間を入力してください。\n例：35",
        },
      ]);

      setStep(3);
      return;
    }

    // STEP 3: 年数
    if (step === 3) {
      const years = Number(userMsg);

      setLoanData((prev) => ({
        ...prev,
        years,
      }));

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "想定金利を入力してください。\n例：0.8",
        },
      ]);

      setStep(4);
      return;
    }

    // STEP 4: 金利
    if (step === 4) {
      const rate = Number(userMsg);

      const finalData = {
        ...loanData,
        rate,
      };

      const principal =
        (finalData.price || 0) -
        (finalData.downPayment || 0);

      const monthly = calculateLoan(
        principal,
        rate,
        finalData.years || 35
      );

      const total =
        monthly * (finalData.years || 35) * 12;

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
# 🏠 シミュレーション結果

## 選択プラン
${finalData.plan}

## 借入額
${principal.toLocaleString()} 円

## 金利
${rate} %

## 返済年数
${finalData.years} 年

---

# 💰 毎月返済額
## ${monthly.toLocaleString()} 円

# 💴 総返済額
## ${total.toLocaleString()} 円
`,
        },
      ]);

      setStep(5);

      return;
    }

    // 通常会話
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        chatId: "test-user",
        message: userMsg,
      }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      {
        role: "bot",
        text: data.reply,
      },
    ]);
  }

  return (
    <div style={styles.container(visible)}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>
          🏠 住宅AIコンシェルジュ
        </h2>
      </div>

      {/* チャット */}
      <div style={styles.chatArea}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent:
                c.role === "user"
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                background:
                  c.role === "user"
                    ? "linear-gradient(90deg,#2563eb,#7c3aed)"
                    : "#fff",
                color:
                  c.role === "user"
                    ? "#fff"
                    : "#111",
              }}
            >
              <ReactMarkdown
                components={{
                  img: ({ ...props }) => (
                    <img
                      {...props}
                      style={{
                        maxWidth: "100%",
                        borderRadius: "12px",
                        marginTop: "10px",
                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.15)",
                      }}
                    />
                  ),
                }}
              >
                {c.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* 入力 */}
      <div style={styles.inputArea}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && send()
          }
          placeholder="メッセージを入力..."
          style={styles.input}
        />

        <button
          onClick={send}
          style={styles.button}
        >
          送信
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: (visible: boolean) => ({
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(180deg,#f8fafc,#eef2ff)",
    fontFamily: "sans-serif",
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0)"
      : "translateY(10px)",
    transition: "0.5s ease",
  }),

  header: {
    padding: "16px 24px",
    background: "#111827",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  chatArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },

  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },

  bubble: {
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "70%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    lineHeight: 1.7,
  },

  inputArea: {
    display: "flex",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },

  button: {
    padding: "12px 20px",
    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow:
      "0 5px 15px rgba(124,58,237,0.4)",
  },
};