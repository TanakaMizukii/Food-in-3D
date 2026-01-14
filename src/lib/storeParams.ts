/**
 * 静的エクスポート（output: 'export'）を使用する場合、
 * 動的ルート[○○]のlayout.tsxにgenerateStaticParamsが必要です。
 * 利用数するルートの関数を各layout.tsxでexportして使用してください。
 */

import storeNames from "@/data/storeInfo";
import { locales } from "@/i18n/routing";

const stores = storeNames.map((store) => store.use_name);

// store のみ
export async function generateStoreStaticParams() {
  return stores.map((store) => ({ store }));
}

// locale + store
export async function generateLocaleStoreStaticParams() {
  return locales.flatMap((locale) =>
    stores.map((store) => ({ locale, store }))
  );
}
