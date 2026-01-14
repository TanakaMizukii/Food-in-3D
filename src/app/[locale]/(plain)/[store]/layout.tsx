import type { Metadata } from "next";
import "./globals.css";
import { generateLocaleStoreStaticParams } from '@/lib/storeParams';
import storeNames from "@/data/storeInfo";

// 静的エクスポート（output: 'export'）では動的ルート配下の全ページにgenerateStaticParamsが必要
// layout.tsxに記述することで配下の全ページに適用される
export const generateStaticParams = generateLocaleStoreStaticParams;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; store: string }> }
): Promise<Metadata> {
  const { store } = await params;
  const nowStoreInfo = storeNames.find((s) => {
      return s.use_name == store;
  });
  return {
    title: `${nowStoreInfo?.true_name} 3Dビュー`,
    description: `${nowStoreInfo?.true_name}の商品を3Dで確認できるデジタルメニューです。料理の形やボリューム感を立体的に確認できるようにするために作りました!`,
    icons: [{ rel: 'icon', url: `/thumb/${store}/${nowStoreInfo?.logo}` }]
  };
}

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
