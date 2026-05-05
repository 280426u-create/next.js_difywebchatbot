"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LP() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <main className="bg-[#f8fafc] text-gray-800 font-sans">

      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <Image src="/lp/logo.png" alt="logo" width={120} height={40} />
        </div>
      </header>

      <div className="pt-24" />

      {/* ヒーロー */}
      <section className="max-w-6xl mx-auto px-6 text-center">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          あなたの暮らしを、もっとスマートに
        </h1>

        <p
          className={`text-gray-500 mb-10 transition-all duration-700 delay-200 ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          AIとデザインで、新しい住宅体験を提供します
        </p>

        <div
          className={`transition-all duration-700 delay-300 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Image
            src="/lp/main.jpg"
            alt="hero"
            width={1200}
            height={600}
            className="rounded-2xl shadow-2xl"
          />
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/query"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition"
          >
            インストールはこちら
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-bold mb-10 text-center">
          アプリの特徴
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🤖",
              title: "AIチャット",
              text: "24時間いつでも住宅相談が可能",
            },
            {
              icon: "🏠",
              title: "理想の空間",
              text: "仮想空間で住まいを体験",
            },
            {
              icon: "🎁",
              title: "ポイント",
              text: "利用で特典がもらえる",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA強調 */}
      <section className="max-w-4xl mx-auto mt-24 px-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-10 rounded-2xl text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-4">
            来場者限定特典
          </h2>

          <Link
            href="/query"
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            アプリインストールはこちら
          </Link>
        </div>
      </section>

      {/* 物件 */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-bold mb-8 text-center">
          分譲中の物件
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
          <Image
            src="/lp/building.jpg"
            alt="building"
            width={1200}
            height={500}
          />
          <div className="p-6 text-center">
            <p className="font-semibold text-lg">
              ビ・ウェル児島赤崎
            </p>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="max-w-5xl mx-auto px-6 mt-24 space-y-6">
        {["0120-383-070", "0120-686-808"].map((tel, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
          >
            <div>
              <p className="text-sm text-gray-500">
                営業時間 10:00 - 18:00
              </p>
              <p className="text-xl text-blue-600 font-bold">
                {tel}
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              お問い合わせ
            </button>
          </div>
        ))}
      </section>

      {/* フッター */}
      <footer className="mt-24 py-10 text-center text-gray-400 text-sm">
        © 和建設
      </footer>

      {/* 浮遊チャットボタン */}
      <Link
        href="/query"
        className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        チャットする
      </Link>

    </main>
  );
}