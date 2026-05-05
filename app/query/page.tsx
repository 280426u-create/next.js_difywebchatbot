"use client";

import { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";

export default function QueryPage() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "bot",
      text: "こんにちは！住宅の相談や間取り、ローンのことなら何でも聞いてください！",
    },
  ]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  async function send() {
    if (!msg) return;

    // ユーザー追加
    setChat((prev) => [...prev, { role: "user", text: msg }]);

    // 仮メッセージ
    setChat((prev) => [
      ...prev,
      { role: "bot", text: "考え中..." },
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        chatId: "test-user",
        message: msg,
      }),
    });

    const data = await res.json();

    // 最後を置き換え
    setChat((prev) => {
      const newChat = [...prev];
      newChat[newChat.length - 1] = {
        role: "bot",
        text: data.reply,
      };
      return newChat;
    });

    setMsg("");
  }

  return (
    <div style={styles.container(visible)}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🏠 住宅AIコンシェルジュ</h2>
      </div>

      {/* チャット */}
      <div style={styles.chatArea}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent:
                c.role === "user" ? "flex-end" : "flex-start",
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
                  c.role === "user" ? "#fff" : "#111",
              }}
            >
              {/* 🔥 画像表示 */}
              <ReactMarkdown
  components={{
    img: ({ ...props }) => (
      <img
        {...props}
        style={{
          maxWidth: "100%",
          borderRadius: "12px",
          marginTop: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
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
          onKeyDown={(e) => e.key === "Enter" && send()}
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
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "60%",
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