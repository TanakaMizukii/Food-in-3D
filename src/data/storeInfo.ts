import type { StoreNames } from "./types";

const storeNames: StoreNames[] = [
    {
        id: 1,
        use_name: 'kaishu',
        true_name: 'ホルモン屋 海州',
        logo: '海州ロゴ.png',
        right_top: 'ファミリーセット切り抜き.png',
        left_bottom: 'カルビ盛り切り抜き.png',
    },
    {
        id: 2,
        use_name: 'denden',
        true_name: 'でんでん',
        logo: 'でんでんロゴ.png',
        right_top: null,
        left_bottom: null,
    },
    {
        id: 3,
        use_name: 'demo',
        true_name: 'テスト用店舗名',
    },
];

export default storeNames;

export function findStoreBySlug(slug: string) {
    return storeNames.find((s) => s.use_name === slug) ?? null;
}