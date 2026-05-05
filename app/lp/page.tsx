"use client";

import Image from "next/image";
import Link from "next/link";

export default function LP() {
  return (
    <main className="bg-gray-100 min-h-screen font-sans">

      {/* ヘッダー */}
      <header className="bg-white shadow p-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <Image src="/lp/logo.png" alt="logo" width={120} height={40} />
        </div>
      </header>

      {/* ヒーロー画像 */}
      <section className="max-w-5xl mx-auto mt-6">
        <Image
          src="/lp/main.jpg"
          alt="hero"
          width={1000}
          height={500}
          className="rounded-lg shadow"
        />
      </section>

      {/* キャッチコピー */}
      <section className="text-center mt-10 px-4">
        <h1 className="text-3xl font-bold mb-4">和建設</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          分譲マンション・戸建住宅・公共事業などを展開。
          地域の文化と歴史を大切にしながら、未来へ続く住まいを提供します。
        </p>
      </section>

      {/* アプリ紹介 */}
      <section className="max-w-5xl mx-auto mt-12 px-4">
        <h2 className="text-xl font-bold mb-6">アプリ紹介</h2>

        <div className="grid gap-6">

          {/* カード1 */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-bold mb-2">AIチャットボット</h3>
            <p className="text-gray-600 text-sm">
              住宅に関する疑問を24時間いつでも解決します。
            </p>
          </div>

          {/* カード2 */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="font-bold mb-2">理想のお部屋</h3>
            <p className="text-gray-600 text-sm">
              仮想空間で理想の暮らしをシミュレーション。
            </p>
          </div>

          {/* カード3 */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-2">🪙</div>
            <h3 className="font-bold mb-2">ポイント</h3>
            <p className="text-gray-600 text-sm">
              利用に応じてポイントが貯まり特典に交換できます。
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto mt-12 px-4">
        <div className="border-4 border-green-700 p-8 text-center rounded-lg">
          <h2 className="text-xl font-bold mb-4">来場者限定特典</h2>

          <Link
            href="/query"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800"
          >
            アプリインストールはこちら
          </Link>
        </div>
      </section>

      {/* 物件 */}
      <section className="max-w-5xl mx-auto mt-12 px-4">
        <h2 className="text-xl font-bold mb-6">分譲中の物件一覧</h2>

        <div className="bg-white p-4 rounded-lg shadow">
          <Image
            src="/lp/building.jpg"
            alt="building"
            width={1000}
            height={400}
            className="rounded"
          />
          <p className="text-center mt-4 font-semibold">
            ビ・ウェル児島赤崎
          </p>
        </div>

        <div className="text-center mt-6">
          <button className="bg-green-700 text-white px-6 py-3 rounded">
            資料請求はこちらから
          </button>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="max-w-5xl mx-auto mt-12 px-4 space-y-6">

        <div className="border-2 border-green-700 p-6 rounded">
          <p className="mb-2">営業時間 10:00 - 18:00</p>
          <p className="text-blue-600 text-lg">0120-383-070</p>
        </div>

        <div className="border-2 border-green-700 p-6 rounded">
          <p className="mb-2">営業時間 10:00 - 18:00</p>
          <p className="text-blue-600 text-lg">0120-686-808</p>
        </div>

      </section>

      {/* フッター */}
      <footer className="mt-12 bg-white p-6 text-center text-sm text-gray-500">
        © 和建設
      </footer>

    </main>
  );
}