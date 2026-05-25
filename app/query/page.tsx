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
      text: `
# 🏠 AI住宅コンシェルジュ

以下の相談ができます 😊

- 「お部屋相談」
- 「住宅ローン」
- 「間取り相談」
- 「周辺環境」
`,
    },
  ]);

  const [visible, setVisible] = useState(false);

  const [mode, setMode] = useState<
  "normal" |
  "persona" |
  "room" |
  "floor" |
  "view" |
  "area" |
  "loan"
>("normal");

const [persona, setPersona] = useState("");

const [floor, setFloor] = useState("");

const [roomType, setRoomType] = useState("");

  // =========================
  // ローン用 state
  // =========================

  

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
  async function saveLog(user: string, bot: string) {
  await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: "test-user",
      message: user,
      forceReply: bot,
    }),
  });
}
  async function send() {
    if (!msg) return;

    const userMsg = msg;

    // =========================
// 間取り相談開始
// =========================

const roomKeywords = [
  "間取り",
  "部屋",
  "お部屋",
  "部屋探し",
  "部屋の相談",
  "間取り相談",
  "レイアウト",
];

if (
  roomKeywords.some((word) =>
    userMsg.includes(word)
  )
) {

  setMode("room");

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# 🏠 間取り相談

どんな暮らしを希望しますか？ 😊

### 例
- 子育てしやすい
- 在宅ワーク向け
- 単身向け
- 広いリビング
`,
    },
  ]);

  setMsg("");

  return;
}
    // =========================
// ペルソナ診断開始
// =========================

if (
  userMsg.includes("お部屋相談")
) {
  setMode("persona");

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# あなたの情報を教えてください！

### 選択肢
- 50代夫婦
- 子育てファミリー
- 単身
- 共働き
- 投資家
`,
    },
  ]);

  setMsg("");

  return;
}

      // =========================================
  // ★ ローン中に他の質問が来たら Dify に送る処理
  // =========================================

  
    // ユーザー表示
    setChat((prev) => [
      ...prev,
      { role: "user", text: userMsg },
    ]);

    setMsg("");

// =========================
// ペルソナ回答
// =========================

if (mode === "persona") {

  setPersona(userMsg);

  setMode("floor");

  let recommendFloor = "14";

  if (userMsg.includes("投資")) {
    recommendFloor = "10";
  }

  if (userMsg.includes("単身")) {
    recommendFloor = "8";
  }

  setFloor(recommendFloor);

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# 🏙 AI分析結果

${userMsg} の場合…

## おすすめ階数
${recommendFloor}階

### 理由
- 日当たりが良い
- 騒音が少ない
- 将来的な資産価値が高い

「眺望」と入力すると
おすすめ眺望を表示します 😊
`,
    },
  ]);

  return;
}
// =========================
// 眺望表示
// =========================

if (
  (mode === "floor" || mode === "view") &&
  userMsg.includes("眺望")
) {
  setMode("view");

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# 🌇 ${floor}14階の眺望
- 朝日がしっかり入ります
- 高層階なので静かです
- 眺望が抜けています

![眺望](/view14.jpg)
`,
    },
  ]);

  return;
}

// =========================
// 周辺質問
// =========================

if (
  mode === "view" &&
  userMsg.includes("周辺")
) {

  setMode("area");

  let suggest = "";

  if (
    persona.includes("子育て")
  ) {
    suggest = `
### よくある質問 😊
- 小学校は近い？
- 公園はある？
- 病院は？
`;
  }

  if (
    persona.includes("単身")
  ) {
    suggest = `
### よくある質問 😊
- コンビニ近い？
- 駅徒歩何分？
- 治安は？
`;
  }

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# 📍 周辺環境について

${suggest}

気になることを自由に聞いてください 😊
`,
    },
  ]);

  return;
}

// =========================
// 間取り提案
// =========================

if (mode === "room") {

  let room = "3LDK";
  let image = "/rooms/3ldk.jpg";

  if (
    userMsg.includes("広いリビング")
  ) {
    room = "1LDK";
    image = "/rooms/1ldk.jpg";
  }

  if (
    userMsg.includes("在宅")
  ) {
    room = "2LDK + WORK";
    image = "/rooms/2ldk-work.jpg";
  }

  setRoomType(room);

  setMode("view");

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: `
# 🏠 おすすめ間取り

## ${room}

### おすすめポイント
- 収納が広い
- 動線が良い
- 開放感があります

![間取り](${image})

### 立面図
![立面図](/elevation/${floor || "14"}f.jpg)

---

「眺望」と入力すると
この階層の眺望も見れます 😊
`,
    },
  ]);

  return;
}


        // =========================
    // ローン開始
    // =========================

    if (
      userMsg.includes("ローン") ||
      userMsg.includes("シミュ") ||
      userMsg.includes("住宅ローン")
    ) {
      setMode("loan");

      setLoanStep("family");

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: `
# 🏠 住宅ローン診断を開始します！

まずは **ご家族構成** を教えてください。

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
    // STEP 1 家族構成
    // =========================

    if (mode === "loan" && loanStep === "family") {
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
ありがとうございます 😊

次に、現在の **年齢** を教えてください 🎂
          `,
        },
      ]);

      return;
    }

    // =========================
    // STEP 3 年齢
    // =========================

    if (mode === "loan" && loanStep === "age") {
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

    if (mode === "loan" && loanStep === "income") {
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

    if (mode === "loan" && loanStep === "price") {
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

    if (mode === "loan" && loanStep === "down") {
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

    if (mode === "loan" && loanStep === "monthly") {
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

    if (mode === "loan" && loanStep === "years") {
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

    if (mode === "loan" && loanStep === "rate") {
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


`,
        },
      ]);

      setMode("normal");

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
  
  headers:{ "Content-Type": "application/json",
  },

  body: JSON.stringify({
    chatId: "test-user",

    message: `
ユーザー属性:
${persona}

選択階数:
${floor}階

質問:
${userMsg}
`,
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

    maxWidth:
      c.role === "user"
        ? "75%"
        : "1000px",

    background:
      c.role === "user"
        ? "linear-gradient(135deg,#2563eb,#7c3aed)"
        : "rgba(255,255,255,0.72)",

    color:
      c.role === "user"
        ? "#fff"
        : "#111",

    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  }}
>
                
              <ReactMarkdown
                components={{
                  img: ({ ...props }) => (
                    <img
                      {...props}
                      style={{
                        maxWidth: "420px",
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
    background: `
linear-gradient(
  180deg,
  #f8fafc 0%,
  #eef2ff 45%,
  #e0e7ff 100%
)
`,
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

  padding: "32px 40px 120px",

  overflowY: "auto",

  display: "flex",

  flexDirection: "column",

  gap: "14px",

  scrollBehavior: "smooth",
},

  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },

  bubble: {
  padding: "10px 14px",

  borderRadius: "18px",

  maxWidth: "55%",

 width: "70%" ,

  fontSize: "15px",

  lineHeight: 1.5,

  letterSpacing: "0",

  whiteSpace: "pre-wrap",

  wordBreak: "break-word",

  overflowWrap: "break-word",

  backdropFilter: "blur(12px)",

  WebkitBackdropFilter: "blur(12px)",

  boxShadow:
    "0 10px 30px rgba(15,23,42,0.08)",

  border:
    "1px solid rgba(255,255,255,0.18)",

  transition:
    "all 0.25s cubic-bezier(.4,0,.2,1)",

  animation: "fadeUp 0.25s ease",
},

  inputArea: {
  display: "flex",

  padding: "18px",

  gap: "12px",

  background:
    "rgba(255,255,255,0.72)",

  backdropFilter: "blur(20px)",

  borderTop:
    "1px solid rgba(255,255,255,0.2)",

  position: "sticky",

  bottom: 0,
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