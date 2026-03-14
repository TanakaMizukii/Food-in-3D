import type { ProductModelsProps, Category, StoreTranslations, StoreInfo } from './types';
import type { Locale } from '@/i18n/routing';
import { getLocalizedProductsSync, getLocalizedCategoriesSync } from '@/lib/getLocalizedMenu';

// 店舗ごとのMenuInfo
import { productModels as dendenModels, productCategory as dendenCategory, categories as dendenCategories } from './denden/MenuInfo';
import { productModels as kaishuModels, productCategory as kaishuCategory, categories as kaishuCategories } from './kaishu/MenuInfo';
import { productModels as theSourceDinerModels, productCategory as theSourceDinerCategory, categories as theSourceDinerCategories } from './theSourceDiner/MenuInfo';

// 店舗ごとの翻訳データ
import kaishuTranslations from './kaishu/translations';
import dendenTranslations from './denden/translations';
import theSourceDinerTranslations from './theSourceDiner/translations';

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
    theSourceDiner: { productModels: theSourceDinerModels, productCategory: theSourceDinerCategory, jaProductCategory: theSourceDinerCategory, categories: theSourceDinerCategories },
};

// 店舗ごとの翻訳マッピング
export const storeTranslationsMap: Record<string, Record<string, StoreTranslations>> = {
    kaishu: kaishuTranslations,
    denden: dendenTranslations,
    theSourceDiner: theSourceDinerTranslations,
};

// デフォルトの店舗メニュー
export const defaultStoreMenu: StoreMenu = storeMenuMap['denden'];

// 店舗スラッグからメニューを取得する関数
export function getStoreMenu(store: string): StoreMenu {
    return storeMenuMap[store] ?? defaultStoreMenu;
}

// storeInfoのdefaultModelテキストをローカライズした新しいstoreInfoを返す
export function getLocalizedStoreInfo(storeInfo: StoreInfo | null, storeMenu: StoreMenu, locale: Locale): StoreInfo | null {
    if (!storeInfo || locale === 'ja') return storeInfo;
    const defaultModel = storeInfo.firstEnvironment?.defaultModel;
    if (!defaultModel) return storeInfo;

    // 日本語のベースメニューで一致するproductを探しindexを特定
    const baseMenu = getStoreMenu(storeInfo.use_name);
    const baseIndex = baseMenu.productModels.findIndex(p => p.name === defaultModel.name);
    if (baseIndex < 0) return storeInfo;

    const localizedProduct = storeMenu.productModels[baseIndex];
    return {
        ...storeInfo,
        firstEnvironment: {
            ...storeInfo.firstEnvironment!,
            defaultModel: {
                ...defaultModel,
                name: localizedProduct.name,
                detail: localizedProduct.description,
                price: localizedProduct.price,
            },
        },
    };
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
