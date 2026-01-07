// app/[locale]/layout.tsx
export function generateStaticParams() {
  return [
    { locale: "ja" },
    { locale: "en" },
    { locale: "zh" },
    { locale: "ko" },
  ]; // 使う分だけ列挙
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
