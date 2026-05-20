"use client";

import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "こんにちは！✨\nAIコンシェルジュ cofi です \nお気軽にご相談ください😊",
    },
  ]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input;

  setMessages((prev) => [
    ...prev,
    { from: "user", text: userText },
  ]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/cofi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }), // ← 重要
    });

    const data = await res.json();

    let reply =
  data.answer ||
  data.raw ||
  data.message || // 追加
  "エラーが発生しました";

if (typeof reply !== "string") {
  reply = JSON.stringify(reply, null, 2);   // ← これが重要！
}

    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: reply,
      },
    ]);
  } catch (error: unknown) {
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: "通信エラーが発生しました😭",
      },
    ]);
  }

  setLoading(false);
};

  return (
    <>
      {/* 開閉ボタン */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",

          right: "24px",

          bottom: "24px",

          width: "66px",

          height: "66px",

          borderRadius: "999px",

           background: `
linear-gradient(
135deg,
#3A7D5D,#5CA27C
)
`,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          color: "#fff",

          fontSize: "30px",

          cursor: "pointer",

          boxShadow:
            "0 20px 40px rgba(58,125,93,0.18)",

          zIndex: 9999,

          transition: "all .25s ease",
        }}
      >
        cofi!
      </div>

      {/* ウィンドウ */}
      {open && (
        <div
          style={{
            position: "fixed",

            right: "24px",

            bottom: "95px",

            width: "360px",

            height: "480px",

            background:
"rgba(246,252,248,0.88)",

            backdropFilter: "blur(20px)",

            WebkitBackdropFilter: "blur(20px)",

            borderRadius: "28px",

            overflow: "hidden",

            display: "flex",

            flexDirection: "column",

            boxShadow:
              "0 25px 70px rgba(15,23,42,0.25)",

            border:
"1px solid rgba(92,162,124,0.15)",

            zIndex: 9999,

            animation: "fadeUp .3s ease",
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              padding: "18px 20px",

              background:
                "linear-gradient(135deg,#4338ca,#7c3aed)",

              color: "#fff",

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                cofi
              </div>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.85,
                  marginTop: "4px",
                }}
              >
                AI Concierge Assistant
              </div>
            </div>

            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: "#4ade80",
                boxShadow:
                  "0 0 10px rgba(74,222,128,0.8)",
              }}
            />
          </div>

          {/* メッセージ */}
          <div
            style={{
              flex: 1,

              overflowY: "auto",

              padding: "18px",

              display: "flex",

              flexDirection: "column",

              gap: "12px",

              background: `
linear-gradient(
180deg,
#F7FBF8 0%,
#EEF6F1 100%
)
`,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",

                  justifyContent:
                    msg.from === "user"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",

                    padding: "12px 16px",

                    borderRadius:
                      msg.from === "user"
                        ? "18px 18px 6px 18px"
                        : "18px 18px 18px 6px",

                    background:
                      msg.from === "user"
                        ? "linear-gradient(135deg,#4F9A73,#6DB28C)"
                        : "rgba(255,255,255,0.9)",

                    color:
                      msg.from === "user"
                        ? "#fff"
                        : "#111827",

                    fontSize: "14px",

                    lineHeight: 1.7,

                    whiteSpace: "pre-wrap",

                    boxShadow:
                      msg.from === "user"
                        ? "0 10px 25px rgba(99,102,241,0.25)"
                        : "0 10px 25px rgba(15,23,42,0.06)",

                    border:
                      msg.from === "bot"
                        ? "1px solid rgba(255,255,255,0.7)"
                        : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",

                    borderRadius:
                      "18px 18px 18px 6px",

                    background:
                      "rgba(255,255,255,0.9)",

                    fontSize: "14px",

                    color: "#555",

                    boxShadow:
                      "0 10px 25px rgba(15,23,42,0.06)",
                  }}
                >
                  cofi が考えています...
                </div>
              </div>
            )}
          </div>

          {/* 入力欄 */}
          <div
            style={{
              padding: "16px",

              background:
                "rgba(255,255,255,0.75)",

              backdropFilter: "blur(20px)",

              borderTop:
                "1px solid rgba(255,255,255,0.5)",

              display: "flex",

              gap: "10px",
            }}
          >
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
              placeholder="メッセージを入力..."
              style={{
                flex: 1,

                border: "none",

                outline: "none",

                padding: "14px 16px",

                borderRadius: "14px",

                background: "#fff",

                fontSize: "14px",

                boxShadow:
                  "0 4px 15px rgba(15,23,42,0.06)",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                width: "52px",

                border: "none",

                borderRadius: "14px",

                background:
                  "linear-gradient(135deg,#4f46e5,#7c3aed)",

                color: "#fff",

                cursor: "pointer",

                fontSize: "18px",

                boxShadow:
                  "0 10px 25px rgba(99,102,241,0.35)",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}