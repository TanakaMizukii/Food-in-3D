import { NextIntlClientProvider } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { notFound } from 'next/navigation';

// 静的にメッセージをインポート
import jaMessages from '../../../messages/ja.json';
import enMessages from '../../../messages/en.json';
import zhMessages from '../../../messages/zh.json';
import koMessages from '../../../messages/ko.json';

// Record<K, V>とは[キーが K、値が V のオブジェクト]という意味
// typeof jaMessages を使うとen,zh,koもja と同じキー構造を持たないとエラーになるため利用
const messagesMap: Record<Locale, typeof jaMessages> = {
  ja: jaMessages,
  en: enMessages,
  zh: zhMessages,
  ko: koMessages,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log(locale);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = messagesMap[locale as Locale];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
