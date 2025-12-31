import type { ProductModelsProps } from './types';

// 店舗ごとのMenuInfo
import { productModels as dendenModels, productCategory as dendenCategory } from './denden/MenuInfo';
import { productModels as kaishuModels, productCategory as kaishuCategory } from './kaishu/MenuInfo';

export type StoreMenu = {
    productModels: ProductModelsProps;
    productCategory: string[];
};

// 店舗ごとのメニューマッピング
// 新しい店舗を追加する場合はここにエントリを追加してください
export const storeMenuMap: Record<string, StoreMenu> = {
    denden: { productModels: dendenModels, productCategory: dendenCategory },
    kaishu: { productModels: kaishuModels, productCategory: kaishuCategory },
};

// デフォルトの店舗メニュー
export const defaultStoreMenu: StoreMenu = storeMenuMap['denden'];

// 店舗スラッグからメニューを取得する関数
export function getStoreMenu(storeSlug: string): StoreMenu {
    return storeMenuMap[storeSlug] ?? defaultStoreMenu;
}
