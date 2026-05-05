"use client";

import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "こんにちは！何かお困りですか？" },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // ユーザー表示
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
    ]);
    setInput("");

    try {
      const url = process.env.NEXT_PUBLIC_DIFY_API_URL;

      if (!url) {
        throw new Error("DIFY_API_URLが設定されていません");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: userText,
          response_mode: "blocking",
          user: "user-001",
        }),
      });

      const data = await res.json();

      const reply = data.answer || "エラーが発生しました";

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "通信エラーが発生しました" },
      ]);
    }
  };

  return (
    <>
      {/* 右下ボタン */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(90deg,#2563eb,#7c3aed)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        💬
      </div>

      {/* チャットウィンドウ */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "90px",
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "12px",
              fontWeight: "bold",
            }}
          >
            サポートチャット
          </div>

          {/* メッセージエリア */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "14px",
              color: "#333",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  textAlign:
                    msg.from === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    background:
                      msg.from === "user"
                        ? "#2563eb"
                        : "#e5e7eb",
                    color:
                      msg.from === "user" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    display: "inline-block",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* 入力欄 */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "6px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="メッセージを入力..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
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