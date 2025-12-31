import type { StoreInfo } from "./types";

const storeInfo: StoreInfo[] = [
    {
        id: 1,
        use_name: 'kaishu',
        true_name: 'ホルモン屋 海州',
        logo: '海州ロゴ.png',
        right_top: 'ファミリーセット切り抜き.png',
        left_bottom: 'カルビ盛り切り抜き.png',
        firstEnvironment: {
            hdrPath: '/hdr/kaishu/',
            hdrFile: 'kaisyu_73_small.hdr',
            defaultModel: {
                name: 'カルビ盛り',
                path: '/models/calbee_set_comp.glb',
                detail: '特上カルビ・上カルビ・並みカルビ・切り落としカルビがワンプレートでまとめて食べられます！！',
                price: '2,400 (税込 2,640)',
            },
        }
    },
    {
        id: 2,
        use_name: 'denden',
        true_name: 'でんでん',
        logo: 'でんでんロゴ.png',
        right_top: null,
        left_bottom: null,
        firstEnvironment: {
            hdrPath: '/hdr/denden/',
            hdrFile: 'dndn_2.1_small.hdr',
            defaultModel: {
                name: '2種の鶏唐コンビ丼（特盛）',
                path: '/models/denden/chicken_combo_large_comp.glb',
                detail: '2種類の鶏唐揚げが通常盛りの倍の量で楽しめます！。',
                price: '税込み:1250',
            },
        }
    },
    {
        id: 3,
        use_name: 'demo',
        true_name: 'テスト用店舗名',
    },
];

export default storeInfo;

export function findStoreBySlug(slug: string) {
    return storeInfo.find((s) => s.use_name === slug) ?? null;
}