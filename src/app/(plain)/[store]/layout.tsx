import type { Metadata } from "next";
import "./globals.css";
import { generateStoreStaticParams } from '@/lib/storeParams';

// 静的エクスポート（output: 'export'）では動的ルート配下の全ページにgenerateStaticParamsが必要
// layout.tsxに記述することで配下の全ページに適用される
export const generateStaticParams = generateStoreStaticParams;

export const metadata: Metadata = {
  title: "海州 商品3Dビュワー",
  description: "Start 3D Viewer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
