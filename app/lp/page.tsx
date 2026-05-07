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
    <>
      {/* 🔥 固定ヘッダー */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "70px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src="/lp/logo.png"
          alt="和建設"
          style={{ height: "40px", cursor: "pointer" }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        />
      </div>

      {/* 🔥 メイン */}
      <main
        style={{
          fontFamily: "sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
          paddingTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "80px 20px",
          }}
        >
          {/* HERO */}
          <section
            style={{
              textAlign: "center",
              marginBottom: "120px",
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(30px)",
              transition: "0.8s ease",
            }}
          >
            <div style={{ marginBottom: "30px" }}>
              <p style={{ fontSize: "14px", color: "#666" }}>
                わ・わ・わ、和と書いて、かのう建設。
              </p>

              <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
                和建設
              </h1>

              <p style={{ fontSize: "18px", color: "#555" }}>
                企業レベルの信頼感とデザインで、ユーザーの心をつかむ和建設へ
              </p>
            </div>

            <div
              style={{
                marginTop: "50px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
              }}
            >
              <Image
                src="/lp/main.jpg"
                alt="メイン画像"
                width={1100}
                height={650}
                style={{ width: "100%" }}
              />
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "30px",
                lineHeight: "1.8",
              }}
            >
              和建設は岡山・高知の2拠点で、分譲マンション事業・戸建て住宅事業・公共事業などを展開しております。
            ただハコを作って売るのではなく、時代の一歩先を見据えながら、そしてその街の歴史や文化を大切にしながら想像を広げ、
            技術を磨き、社員一人ひとりが誇りをもって仕事に取り組んでいます。

            </p>

            <div style={{ marginTop: "50px" }}>
              <Link
                href="/query"
                style={{
                  padding: "18px 48px",
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "#fff",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                ダウンロードはこちらから
              </Link>
            </div>
          </section>

          {/* アプリ紹介 */}
        <section style={{ marginBottom: "100px" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "40px" }}>
            アプリ紹介
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
            }}
          >
            {[
              "チャット機能で疑問や不安を即解消",
              "貯まったポイントで理想の部屋を再現",
              "ガチャ機能や特典で楽しさもプラス",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  padding: "30px",
                  borderRadius: "16px",
                  background: "#fff",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </section>


          {/* カルーセル */}
          <section style={{ textAlign: "center", marginBottom: "120px" }}>
            <h2 style={{ fontSize: "30px" }}>
              分譲中の物件一覧
            </h2>

            <Carousel />

            <div style={{ marginTop: "30px" }}>
            <button
              style={{
                padding: "16px 40px",
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
              }}
            >
              資料請求はこちらから
            </button>
          </div>
        </section>

        {/* 来場特典 */}
        <section style={{ textAlign: "center", marginBottom: "120px" }}>
          <div
            style={{
              border: "6px dashed #16a34a",
              borderRadius: "20px",
              padding: "60px 40px",
              display: "inline-block",
              background: "#f9fafb",
            }}
          >
            <p style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "30px" }}>
              来場者限定特典
            </p>

            <Link
              href="/query"
              style={{
                padding: "22px 60px",
                background: "linear-gradient(90deg,#16a34a,#22c55e)",
                color: "#fff",
                borderRadius: "999px",
                fontSize: "22px",
                textDecoration: "none",
              }}
            >
              ダウンロードはこちら
            </Link>
          </div>
        </section>
      </div>

          
        

        <ChatBot />
      </main>
    </>
  );
}

/* =========================
   カルーセル
========================= */
function Carousel() {
  const baseImages = [
  "/lp/house1.jpg",
  "/lp/house2.jpg",
  "/lp/house3.jpg",
];

// 👇 ダミー追加
const images = [
  baseImages[baseImages.length - 1], // 最後
  ...baseImages,
  baseImages[0], // 最初
];

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => prev + 1);
  }, 3000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  if (index === images.length - 1) {
    setTimeout(() => {
      setTransition(false); // ←アニメーション切る
      setIndex(1);
    }, 600);
  }

  if (index === 0) {
    setTimeout(() => {
      setTransition(false);
      setIndex(images.length - 2);
    }, 600);
  }
}, [index]);

  useEffect(() => {
  if (!transition) {
    const t = setTimeout(() => {
      setTransition(true);
    }, 50);

    return () => clearTimeout(t);
  }
}, [transition]);



  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "800px",
        margin: "40px auto",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${index * 100}%)`,
            transition: transition ? "0.6s ease" : "none",
          }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              style={{ width: "100%" }}
            />
          ))}
        </div>
      </div>

      <button onClick={prev} style={btn("left")}>
        ‹
      </button>
      <button onClick={next} style={btn("right")}>
        ›
      </button>
    </div>
  );
}

function btn(pos: "left" | "right") {
  return {
    position: "absolute" as const,
    top: "50%",
    [pos]: "10px",
    transform: "translateY(-50%)",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.8)",
    cursor: "pointer",
  };
}