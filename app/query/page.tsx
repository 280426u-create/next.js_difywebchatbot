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
- 「周辺環境」（未完成）
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
    // 先にユーザー吹き出し追加
setChat((prev) => [
  ...prev,
  { role: "user", text: userMsg },
]);

setMsg("");

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

  const botReply = `
# 🏠 間取り相談

どんな暮らしを希望しますか？ 😊

### 例
- 子育てしやすい
- 在宅ワーク向け
- 単身向け
- 広いリビング
`;
setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

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

  const botReply = `
# あなたの情報を教えてください！

### 選択肢
- 50代夫婦
- 子育てファミリー
- 単身
- 共働き
- 投資家
`;

setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

setMsg("");

return;
}

      // =========================================
  // ★ ローン中に他の質問が来たら Dify に送る処理
  // =========================================

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

  const botReply = `
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
`;

setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

return;
}
// =========================
// 眺望表示
// =========================

if (mode === "view") {

  const lowerMsg = userMsg.toLowerCase();

  let viewImage = "/views/typea.png";

  if (lowerMsg.includes("atype")) {
    viewImage = "/views/typea.png";
  }

  if (lowerMsg.includes("ktype")) {
    viewImage = "/views/typek.png";
  }

  if (lowerMsg.includes("etype")) {
    viewImage = "/views/typee.png";
  }

  if (lowerMsg.includes("htype")) {
    viewImage = "/views/typeh.png";
  }

  if (lowerMsg.includes("ctype")) {
    viewImage = "/views/typec.png";
  }

  if (lowerMsg.includes("dtype")) {
    viewImage = "/views/typd2.png";
  }

  if (
    lowerMsg.includes("眺望") ||
    lowerMsg.includes("atype") ||
    lowerMsg.includes("ktype") ||
    lowerMsg.includes("etype") ||
    lowerMsg.includes("htype") ||
    lowerMsg.includes("ctype") ||
    lowerMsg.includes("dtype")
  ) {

    const selectedType =
  lowerMsg.includes("atype") ? "AType" :
  lowerMsg.includes("ktype") ? "KType" :
  lowerMsg.includes("etype") ? "EType" :
  lowerMsg.includes("htype") ? "HType" :
  lowerMsg.includes("ctype") ? "CType" :
  lowerMsg.includes("dtype") ? "DType" :
  roomType;

const botReply = `
# 🌇 ${selectedType}のお部屋から見た眺望

![眺望](${viewImage})

- 日当たり良好
- 開放感があります
---
他にご相談はありますか？ 😊
`;
    setChat((prev) => [
      ...prev,
      {
        role: "bot",
        text: botReply,
      },
    ]);

    await saveLog(userMsg, botReply);

    return;
  }
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

  const botReply = `
# 📍 周辺環境について

${suggest}

気になることを自由に聞いてください 😊
`;

setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

return;
}

// =========================
// 間取り提案
// =========================

if (mode === "room") {

  const roomPatterns = [
    {
      keyword: "子育て",

      type1: "AType",
      room1: "AType 3LDK",
      image1: "/rooms/typea.jpg",
      elevation1: "/elevation/typea.jpg",
      view1: "/views/typea.jpg",

      type2: "KType",
      room2: "KType 4LDK",
      image2: "/rooms/typek.jpg",
      elevation2: "/elevation/typek.jpg",
      view2: "/views/typek.jpg",

      point: "ウォークインクローゼット付き",
    },

    {
      keyword: "在宅",

      type1: "EType",
      room1: "EType 1LDK",
      image1: "/rooms/typee.jpg",
      elevation1: "/elevation/typee.jpg",
      view1: "/views/typee.jpg",

      type2: "HType",
      room2: "HType 1LDK",
      image2: "/rooms/typeh.jpg",
      elevation2: "/elevation/typeh.jpg",
      view2: "/views/typeh.jpg",

      point: "収納スペースが充実",
    },

    {
      keyword: "単身",

      type1: "EType",
      room1: "EType 1LDK",
      image1: "/rooms/typee.jpg",
      elevation1: "/elevation/typee.jpg",
      view1: "/views/typee.jpg",

      type2: "HType",
      room2: "HType 1LDK",
      image2: "/rooms/typeh.jpg",
      elevation2: "/elevation/typeh.jpg",
      view2: "/views/typeh.jpg",

      point: "単身向け設計",
    },

    {
      keyword: "広いリビング",

      type1: "CType",
      room1: "CType 3LDK",
      image1: "/rooms/typec.jpg",
      elevation1: "/elevation/typec.jpg",
      view1: "/views/typec.jpg",

      type2: "DType",
      room2: "DType 2LDK",
      image2: "/rooms/typed2.jpg",
      elevation2: "/elevation/typed2.jpg",
      view2: "/views/typed2.jpg",

      point: "開放感あるリビング",
    },
  ];

  const matched =
    roomPatterns.find((r) =>
      userMsg.includes(r.keyword)
    ) || roomPatterns[0];

  const room1 = matched.room1;
  const image1 = matched.image1;
  const elevation1 = matched.elevation1;
  const view1 = matched.view1;

  const room2 = matched.room2;
  const image2 = matched.image2;
  const elevation2 = matched.elevation2;
  const view2 = matched.view2;

  const point = matched.point;

  // 選択された眺望を保存
  setRoomType(view1);

  setMode("view");

  const botReply = `
# 🏠 おすすめ間取り比較

## ${room1}

![間取り1](${image1})

![立面図1](${elevation1})

---

## ${room2}

![間取り2](${image2})

![立面図2](${elevation2})

---

### 特徴
${point}

### 選択例
- 「ATypeがいい」
- 「KTypeがいい」

と入力すると、
その部屋の眺望を表示できます 😊
`;

  setChat((prev) => [
    ...prev,
    {
      role: "bot",
      text: botReply,
    },
  ]);

  await saveLog(userMsg, botReply);

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

      const botReply = `
# 🏠 住宅ローン診断を開始します！

まずは **ご家族構成** を教えてください。

### 例
- 夫婦2人
- 4人家族
- 単身
`;

setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

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

      const botReply = `
ありがとうございます 😊

次に、現在の **年齢** を教えてください 🎂
`;

setChat((prev) => [
  ...prev,
  {
    role: "bot",
    text: botReply,
  },
]);

await saveLog(userMsg, botReply);

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

      const botReply =`
世帯年収を教えてください 💰

### 例
- 450万円
- 700万円
`;
setChat((prev) =>[
  ...prev,{role:"bot",
    text:botReply,
  },
]);
       await saveLog(userMsg,botReply);

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

      const botReply = `
購入予定の物件価格を教えてください 🏠

### 例
- 3500万円
- 4200万円
`;
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);

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

      const botReply = `
頭金の予定額を教えてください ✨

※ なしの場合は「0」
`;
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);

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

      const botReply = `
毎月の希望返済額はありますか？ 😊

### 例
- 8万円
- 10万円
- 特になし
`;
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);

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

      const botReply = `
返済年数を選択してください 📅

### 選択肢
- 25年
- 30年
- 35年
- 40年
`;
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);
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

      const botReply = `
最後に、想定金利を入力してください 📈

### 例
- 0.7
- 0.8
- 1.2
`;
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);

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

      const botReply = `
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
`;
        
      setChat((prev) =>[
        ...prev,{role:"bot",
          text:botReply,
        },
      ]);
       await saveLog(userMsg,botReply);
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