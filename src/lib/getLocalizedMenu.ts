import type { ProductModel, Category, StoreTranslations } from '@/data/types';
import type { Locale } from '@/i18n/routing';

// 店舗ごとの翻訳データを動的にインポート
const storeTranslationsMap: Record<string, () => Promise<{ default: Record<string, StoreTranslations> }>> = {
    kaishu: () => import('@/data/kaishu/translations'),
    denden: () => import('@/data/denden/translations'),
};

// 翻訳データをキャッシュ
const translationsCache: Record<string, Record<string, StoreTranslations>> = {};

async function getStoreTranslations(storeName: string): Promise<Record<string, StoreTranslations> | null> {
    if (translationsCache[storeName]) {
        return translationsCache[storeName];
    }

    const loader = storeTranslationsMap[storeName];
    if (!loader) {
        return null;
    }

    try {
        const module = await loader();
        translationsCache[storeName] = module.default;
        return module.default;
    } catch {
        return null;
    }
}

// 商品データにローカライズを適用
export function applyProductTranslation(
    product: ProductModel,
    translations: StoreTranslations | undefined,
    locale: Locale
): ProductModel {
    // 日本語の場合は翻訳不要
    if (locale === 'ja' || !translations) {
        return product;
    }

    const productTranslation = translations.products[product.id];
    if (!productTranslation) {
        return product;
    }

    return {
        ...product,
        name: productTranslation.name,
        shortName: productTranslation.shortName,
        description: productTranslation.description,
        minDetail: productTranslation.minDetail,
        serving: productTranslation.serving,
        part: productTranslation.part,
        origin: productTranslation.origin,
        recPeople: productTranslation.recPeople,
        recommended: productTranslation.recommended,
        tags: productTranslation.tags,
    };
}

// カテゴリデータにローカライズを適用
export function applyCategoryTranslation(
    category: Category,
    translations: StoreTranslations | undefined,
    locale: Locale
): Category {
    // 日本語の場合は翻訳不要
    if (locale === 'ja' || !translations) {
        return category;
    }

    const categoryTranslation = translations.categories[category.id];
    if (!categoryTranslation) {
        return category;
    }

    return {
        ...category,
        name: categoryTranslation.name,
        description: categoryTranslation.description,
    };
}

// 全商品データをローカライズ
export async function getLocalizedProducts(
    products: ProductModel[],
    storeName: string,
    locale: Locale
): Promise<ProductModel[]> {
    if (locale === 'ja') {
        return products;
    }

    const storeTranslations = await getStoreTranslations(storeName);
    const translations = storeTranslations?.[locale];

    return products.map(product => applyProductTranslation(product, translations, locale));
}

// 全カテゴリデータをローカライズ
export async function getLocalizedCategories(
    categories: Category[],
    storeName: string,
    locale: Locale
): Promise<Category[]> {
    if (locale === 'ja') {
        return categories;
    }

    const storeTranslations = await getStoreTranslations(storeName);
    const translations = storeTranslations?.[locale];

    return categories.map(category => applyCategoryTranslation(category, translations, locale));
}

// 同期版（クライアントコンポーネント用）- 事前にロードされた翻訳を使用
export function getLocalizedProductsSync(
    products: ProductModel[],
    translations: StoreTranslations | undefined,
    locale: Locale
): ProductModel[] {
    if (locale === 'ja' || !translations) {
        return products;
    }

    return products.map(product => applyProductTranslation(product, translations, locale));
}

export function getLocalizedCategoriesSync(
    categories: Category[],
    translations: StoreTranslations | undefined,
    locale: Locale
): Category[] {
    if (locale === 'ja' || !translations) {
        return categories;
    }

    return categories.map(category => applyCategoryTranslation(category, translations, locale));
}
