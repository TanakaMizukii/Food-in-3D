import type { ProductModelsProps, Category, StoreTranslations } from './types';
import type { Locale } from '@/i18n/routing';
import { getLocalizedProductsSync, getLocalizedCategoriesSync } from '@/lib/getLocalizedMenu';

// 店舗ごとのMenuInfo
import { productModels as dendenModels, productCategory as dendenCategory, categories as dendenCategories } from './denden/MenuInfo';
import { productModels as kaishuModels, productCategory as kaishuCategory, categories as kaishuCategories } from './kaishu/MenuInfo';

// 店舗ごとの翻訳データ
import kaishuTranslations from './kaishu/translations';
import dendenTranslations from './denden/translations';

export type StoreMenu = {
    productModels: ProductModelsProps;
    productCategory: string[];
    jaProductCategory: string[]; // 日本語のカテゴリ名（フィルタリング用）
    categories: Category[];
};

// 店舗ごとのメニューマッピング
// 新しい店舗を追加する場合はここにエントリを追加してください
export const storeMenuMap: Record<string, StoreMenu> = {
    denden: { productModels: dendenModels, productCategory: dendenCategory, jaProductCategory: dendenCategory, categories: dendenCategories },
    kaishu: { productModels: kaishuModels, productCategory: kaishuCategory, jaProductCategory: kaishuCategory, categories: kaishuCategories },
};

// 店舗ごとの翻訳マッピング
export const storeTranslationsMap: Record<string, Record<string, StoreTranslations>> = {
    kaishu: kaishuTranslations,
    denden: dendenTranslations,
};

// デフォルトの店舗メニュー
export const defaultStoreMenu: StoreMenu = storeMenuMap['denden'];

// 店舗スラッグからメニューを取得する関数
export function getStoreMenu(store: string): StoreMenu {
    return storeMenuMap[store] ?? defaultStoreMenu;
}

// 店舗スラッグとロケールからローカライズされたメニューを取得する関数
export function getLocalizedStoreMenu(store: string, locale: Locale): StoreMenu {
    const baseMenu = storeMenuMap[store] ?? defaultStoreMenu;

    // 日本語の場合は翻訳不要
    if (locale === 'ja') {
        return baseMenu;
    }

    const translations = storeTranslationsMap[store]?.[locale];
    const localizedCategories = getLocalizedCategoriesSync(baseMenu.categories, translations, locale);

    return {
        productModels: getLocalizedProductsSync(baseMenu.productModels, translations, locale),
        productCategory: localizedCategories.map(c => c.name), // カテゴリ名を翻訳済みのcategoriesから取得
        jaProductCategory: baseMenu.jaProductCategory, // 日本語のカテゴリ名はそのまま保持
        categories: localizedCategories,
    };
}
