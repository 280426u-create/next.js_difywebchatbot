"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ChatBot from "../../components/ChatBot";
import Link from "next/link";

export default function Page() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        padding: "80px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
        background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
      }}
    >
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          marginBottom: "80px",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "0.8s ease",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          あなたのサービスを、もっとスマートに
        </h1>

        <p style={{ fontSize: "18px", color: "#555", marginTop: "16px" }}>
          企業レベルの信頼感とデザインで、ユーザーの心をつかむLPへ
        </p>

        {/* メイン画像（修正版） */}
        <div
          style={{
            marginTop: "40px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <Image
            src="/lp/main.jpg"
            alt="メイン画像"
            width={1000}
            height={600}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* CTAボタン（修正ポイント①） */}
        <div style={{ marginTop: "40px" }}>
          <Link
            href="/query"
            style={{
              display: "inline-block",
              padding: "18px 40px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fff",
              borderRadius: "999px",
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              boxShadow: "0 10px 30px rgba(124,58,237,0.4)",
              transition: "0.3s",
              transform: "scale(1)",
              textDecoration: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(124,58,237,0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(124,58,237,0.4)";
            }}
          >
            インストールはこちらから
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>特徴</h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {[
            "チャット機能で疑問や不安を即解消",
            "貯まったポイントで作るお部屋のイメージ作成",
            "ガチャ機能やポイント数に応じた景品",
          ].map((text, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                transition: "0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* お客様の声 */}
      <section
        style={{
          padding: "40px",
          borderRadius: "16px",
          background: "linear-gradient(90deg,#eef2ff,#f5f3ff)",
          marginBottom: "60px",
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
          都建て住宅情報
        </h2>
        <p style={{ fontSize: "18px", color: "#444" }}>
          “お知らせ”
        </p>
      </section>

      {/* CTA（修正ポイント②） */}
      <section style={{ textAlign: "center" }}>
        <Link
          href="/query"
          style={{
            display: "inline-block",
            padding: "16px 32px",
            background: "#111827",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "18px",
            textDecoration: "none",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          インストールはこちらから
        </Link>
      </section>

      {/* LP下部の簡易チャット */}
      <ChatBot />
    </main>
  );
}