import type { StoreNames } from "./types";

const storeNames: StoreNames[] = [
    {
        id: 1,
        use_name: 'kaishu',
        true_name: 'ホルモン 屋海州',
    },
    {
        id: 2,
        use_name: 'denden',
        true_name: 'でんでん',
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