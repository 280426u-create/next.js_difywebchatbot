"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Chat = {
  role: string;
  text: string;
};

export default function QueryPage() {
  const [msg, setMsg] = useState("");

  const [chat, setChat] = useState<Chat[]>([
    {
      role: "bot",
      text:
        "こんにちは！🏠\n住宅の相談やローンのことなら何でも聞いてください！\n\nローンシミュレーションをしたい場合は『ローン』と入力してください 😊",
    },
  ]);

  const [visible, setVisible] = useState(false);

  // =========================
  // ローン用 state
  // =========================

  const [loanMode, setLoanMode] = useState(false);

  const [loanStep, setLoanStep] = useState("");

  const [loanData, setLoanData] = useState({
    plan: "",
    family: "",
    age: "",
    income: "",
    price: 0,
    downPayment: 0,
    years: 35,
    rate: 0.8,
    monthlyHope: "",
  });

  useEffect(() => {
    setVisible(true);
  }, []);

  // =========================
  // メッセージ送信
  // =========================

  async function send() {
    if (!msg) return;

    const userMsg = msg;

    // ユーザー表示
    setChat((prev) => [
      ...prev,
      { role: "user", text: userMsg },
    ]);

    setMsg("");

    // =========================
    // ローン開始
    // =========================

    if (
      userMsg.includes("ローン") ||
      userMsg.includes("シミュ") ||
      userMsg.includes("住宅ローン")
    ) {
      setLoanMode(true);

      setLoanStep("plan");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
# 🏠 住宅ローン診断を開始します！

まずはプランを選択してください。

### 選択肢
- 201
- 202
- 203
- 204
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 1 プラン
    // =========================

    if (loanMode && loanStep === "plan") {
      setLoanData((prev) => ({
        ...prev,
        plan: userMsg,
      }));

      setLoanStep("family");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
ありがとうございます 😊

現在のご家族構成を教えてください。

### 例
- 夫婦2人
- 4人家族
- 単身
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 2 家族構成
    // =========================

    if (loanMode && loanStep === "family") {
      setLoanData((prev) => ({
        ...prev,
        family: userMsg,
      }));

      setLoanStep("age");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
現在の年齢を教えてください 🎂
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 3 年齢
    // =========================

    if (loanMode && loanStep === "age") {
      setLoanData((prev) => ({
        ...prev,
        age: userMsg,
      }));

      setLoanStep("income");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
世帯年収を教えてください 💰

### 例
- 450万円
- 700万円
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 4 年収
    // =========================

    if (loanMode && loanStep === "income") {
      setLoanData((prev) => ({
        ...prev,
        income: userMsg,
      }));

      setLoanStep("price");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
購入予定の物件価格を教えてください 🏠

### 例
- 3500万円
- 4200万円
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 5 物件価格
    // =========================

    if (loanMode && loanStep === "price") {
      const price =
        Number(userMsg.replace(/[^0-9]/g, "")) *
        10000;

      setLoanData((prev) => ({
        ...prev,
        price,
      }));

      setLoanStep("down");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
頭金の予定額を教えてください ✨

※ なしの場合は「0」
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 6 頭金
    // =========================

    if (loanMode && loanStep === "down") {
      const down =
        Number(userMsg.replace(/[^0-9]/g, "")) *
        10000;

      setLoanData((prev) => ({
        ...prev,
        downPayment: down,
      }));

      setLoanStep("monthly");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
毎月の希望返済額はありますか？ 😊

### 例
- 8万円
- 10万円
- 特になし
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 7 希望返済額
    // =========================

    if (loanMode && loanStep === "monthly") {
      setLoanData((prev) => ({
        ...prev,
        monthlyHope: userMsg,
      }));

      setLoanStep("years");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
返済年数を選択してください 📅

### 選択肢
- 25年
- 30年
- 35年
- 40年
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 8 年数
    // =========================

    if (loanMode && loanStep === "years") {
      const years = Number(
        userMsg.replace(/[^0-9]/g, "")
      );

      setLoanData((prev) => ({
        ...prev,
        years,
      }));

      setLoanStep("rate");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
最後に、想定金利を入力してください 📈

### 例
- 0.7
- 0.8
- 1.2
`,
        },
      ]);

      return;
    }

    // =========================
    // STEP 9 金利 → 結果
    // =========================

    if (loanMode && loanStep === "rate") {
      const rate = Number(userMsg);

      const finalData = {
        ...loanData,
        rate,
      };

      const principal =
        finalData.price -
        finalData.downPayment;

      const monthlyRate = rate / 100 / 12;

      const months = finalData.years * 12;

      const monthly =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      const total =
        monthly * finalData.years * 12;

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
# 🏠 ローン診断結果

## お客様情報
- プラン：${finalData.plan}
- ご家族：${finalData.family}
- 年齢：${finalData.age}歳
- 世帯年収：${finalData.income}

---

# 💰 シミュレーション結果

## 借入額
${principal.toLocaleString()} 円

## 毎月返済額
${Math.round(monthly).toLocaleString()} 円

## 総返済額
${Math.round(total).toLocaleString()} 円

---

ご希望であれば、

- 「35年と40年比較」
- 「金利違い比較」
- 「無理のない予算診断」

もできます 😊
`,
        },
      ]);

      setLoanMode(false);

      setLoanStep("");

      return;
    }

    // =========================
    // 通常AIチャット
    // =========================

    setChat((prev) => [
      ...prev,
      { role: "bot", text: "考え中..." },
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        chatId: "test-user",
        message: userMsg,
      }),
    });

    const data = await res.json();

    setChat((prev) => {
      const newChat = [...prev];

      newChat[newChat.length - 1] = {
        role: "bot",
        text: data.reply,
      };

      return newChat;
    });
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
                        maxWidth: "240px",
                        width: "100%",
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

      {/* 入力欄 */}
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

        <button onClick={send} style={styles.button}>
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
  padding: "10px 14px",
  borderRadius: "16px",
  maxWidth: "76%",
  fontSize: "14px",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
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