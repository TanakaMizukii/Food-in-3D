import type { Category, ProductModel, ProductModelsProps, StoreEnvironment } from '../types';

// 店舗環境設定
export const storeEnvironment: StoreEnvironment = {
    hdrPath: '/hdr/denden/',
    hdrFile: 'dndn_2.1_small.hdr',
    defaultModel: {
        name: '2種の鶏唐コンビ丼（通常）',
        path: '/models/denden/お試し皿盆4_raw_comp.glb',
        detail: '2種類の鶏唐揚げが楽しめるコンビ丼です。',
        price: '--- (税込 ---)',
    },
};

export const categories: Category[] = [
    {
        id: 1,
        name: 'メインメニュー',
        count: 20,
        description: 'でんでん自慢の丼メニュー'
    },
    {
        id: 2,
        name: '鶏丼系',
        count: 8,
        description: 'ジューシーな鶏肉を使った丼'
    },
    {
        id: 3,
        name: 'カレー',
        count: 4,
        description: 'でんでん特製カレー'
    },
    {
        id: 4,
        name: '丼ぶり',
        count: 2,
        description: '豚肉を使ったボリューム丼'
    },
    {
        id: 5,
        name: '鶏系&豚系丼',
        count: 2,
        description: '鶏と豚の両方を楽しめる丼'
    },
    {
        id: 6,
        name: 'その他',
        count: 4,
        description: 'オムライスやタコライスなど'
    },
];

export const productCategory: string[] = [
    'メインメニュー',
    '鶏丼系',
    'カレー',
    '丼ぶり',
    '鶏系&豚系丼',
    'その他',
];

// 商品とモデルの関連付け (価格は後で追加)
export const productModels: ProductModelsProps = [
    // === 鶏丼系 ===
    {
        id: 1,
        name: '2種の鶏唐コンビ丼（通常）',
        shortName: '鶏唐コンビ丼',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '2種類の鶏唐揚げが楽しめるコンビ丼です。',
        image: '/images/denden/chicken_combo_normal.jpg',
        model: '/models/denden/chicken_combo_normal_raw.glb',
        serving: '通常',
        part: '鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['鶏唐揚げ', 'コンビ', '人気']
    },
    {
        id: 2,
        name: '2種の鶏唐コンビ丼（特盛）',
        shortName: '鶏唐コンビ丼 特盛',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '2種類の鶏唐揚げが楽しめるコンビ丼の特盛サイズです。',
        image: '/images/denden/chicken_combo_large.jpg',
        model: '/models/denden/chicken_combo_large_raw.glb',
        serving: '特盛',
        part: '鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['鶏唐揚げ', 'コンビ', '特盛']
    },
    {
        id: 3,
        name: '2種の鶏唐コンビ丼（超大盛り）',
        shortName: '鶏唐コンビ丼 超大盛',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '2種類の鶏唐揚げが楽しめるコンビ丼の超大盛りサイズです。',
        image: '/images/denden/chicken_combo_xlarge.jpg',
        model: '/models/denden/chicken_combo_xlarge_raw.glb',
        serving: '超大盛り',
        part: '鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['鶏唐揚げ', 'コンビ', '超大盛り', 'ボリューム']
    },
    {
        id: 4,
        name: '松本山賊焼き丼（通常）',
        shortName: '山賊焼き丼',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '松本名物の山賊焼きをのせた丼です。',
        image: '/images/denden/chicken_sanzoku_normal.jpg',
        model: '/models/denden/chicken_sanzoku_normal_raw.glb',
        serving: '通常',
        part: '鶏もも肉',
        origin: '長野県',
        recommended: 'そのまま',
        tags: ['山賊焼き', '松本名物', '人気']
    },
    {
        id: 5,
        name: '松本山賊焼き丼（特盛）',
        shortName: '山賊焼き丼 特盛',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '松本名物の山賊焼きをのせた丼の特盛サイズです。',
        image: '/images/denden/chicken_sanzoku_large.jpg',
        model: '/models/denden/chicken_sanzoku_large_raw.glb',
        serving: '特盛',
        part: '鶏もも肉',
        origin: '長野県',
        recommended: 'そのまま',
        tags: ['山賊焼き', '松本名物', '特盛']
    },
    {
        id: 6,
        name: '松本山賊焼き丼（超大盛り）',
        shortName: '山賊焼き丼 超大盛',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '松本名物の山賊焼きをのせた丼の超大盛りサイズです。',
        image: '/images/denden/chicken_sanzoku_xlarge.jpg',
        model: '/models/denden/chicken_sanzoku_xlarge_raw.glb',
        serving: '超大盛り',
        part: '鶏もも肉',
        origin: '長野県',
        recommended: 'そのまま',
        tags: ['山賊焼き', '松本名物', '超大盛り', 'ボリューム']
    },
    {
        id: 7,
        name: '炙りチーズチキントマトソース丼（通常）',
        shortName: 'チーズチキン丼',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '炙りチーズとトマトソースが絶妙にマッチしたチキン丼です。',
        image: '/images/denden/cheese_chicken_tomato_normal.jpg',
        model: '/models/denden/don_cheese_chicken_tomato_normal_raw.glb',
        serving: '通常',
        part: '鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['チーズ', 'トマトソース', '炙り']
    },
    {
        id: 8,
        name: '炙りチーズチキントマトソース丼（特盛）',
        shortName: 'チーズチキン丼 特盛',
        category: '鶏丼系',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '炙りチーズとトマトソースが絶妙にマッチしたチキン丼の特盛サイズです。',
        image: '/images/denden/cheese_chicken_tomato_large.jpg',
        model: '/models/denden/don_cheese_chicken_tomato_large_raw.glb',
        serving: '特盛',
        part: '鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['チーズ', 'トマトソース', '特盛']
    },

    // === カレー ===
    {
        id: 9,
        name: '松本山賊カレー（通常）',
        shortName: '山賊カレー',
        category: 'カレー',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '山賊焼きをトッピングした特製カレーです。',
        image: '/images/denden/curry_sanzoku_normal.jpg',
        model: '/models/denden/curry_sanzoku_normal_raw.glb',
        serving: '通常',
        part: '鶏もも肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['山賊焼き', 'カレー', '人気']
    },
    {
        id: 10,
        name: '松本山賊カレー（特盛）',
        shortName: '山賊カレー 特盛',
        category: 'カレー',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '山賊焼きをトッピングした特製カレーの特盛サイズです。',
        image: '/images/denden/curry_sanzoku_large.jpg',
        model: '/models/denden/curry_sanzoku_large_raw.glb',
        serving: '特盛',
        part: '鶏もも肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['山賊焼き', 'カレー', '特盛']
    },
    {
        id: 11,
        name: '松本山賊カレー（超大盛り）',
        shortName: '山賊カレー 超大盛',
        category: 'カレー',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '山賊焼きをトッピングした特製カレーの超大盛りサイズです。',
        image: '/images/denden/curry_sanzoku_xlarge.jpg',
        model: '/models/denden/curry_sanzoku_xlarge_raw.glb',
        serving: '超大盛り',
        part: '鶏もも肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['山賊焼き', 'カレー', '超大盛り', 'ボリューム']
    },
    {
        id: 12,
        name: '目玉焼きカレー（通常）',
        shortName: '目玉焼きカレー',
        category: 'カレー',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'トロトロの目玉焼きをのせたカレーです。',
        image: '/images/denden/curry_friedegg_normal.jpg',
        model: '/models/denden/curry_friedegg_normal_raw.glb',
        serving: '通常',
        part: null,
        origin: null,
        recommended: 'そのまま',
        tags: ['目玉焼き', 'カレー', 'シンプル']
    },

    // === 丼ぶり (豚系) ===
    {
        id: 13,
        name: '豚バラ焼肉丼（通常）',
        shortName: '豚バラ焼肉丼',
        category: '丼ぶり',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'ジューシーな豚バラ肉を焼肉スタイルでのせた丼です。',
        image: '/images/denden/pork_yakiniku_normal.jpg',
        model: '/models/denden/don_pork_yakiniku_normal_raw.glb',
        serving: '通常',
        part: '豚バラ肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['豚バラ', '焼肉', 'ジューシー']
    },
    {
        id: 14,
        name: '豚バラ焼肉丼（特盛）',
        shortName: '豚バラ焼肉丼 特盛',
        category: '丼ぶり',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'ジューシーな豚バラ肉を焼肉スタイルでのせた丼の特盛サイズです。',
        image: '/images/denden/pork_yakiniku_large.jpg',
        model: '/models/denden/don_pork_yakiniku_large_raw.glb',
        serving: '特盛',
        part: '豚バラ肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['豚バラ', '焼肉', '特盛']
    },

    // === 鶏系&豚系丼 ===
    {
        id: 15,
        name: '豚の生姜焼き&鶏から丼（通常）',
        shortName: '生姜焼き&鶏から丼',
        category: '鶏系&豚系丼',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '豚の生姜焼きと鶏の唐揚げが両方楽しめる欲張り丼です。',
        image: '/images/denden/mix_gingerpork_chickenkara_normal.jpg',
        model: '/models/denden/mix_gingerpork_chickenkara_normal_raw.glb',
        serving: '通常',
        part: '豚肉・鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['生姜焼き', '鶏から', 'コンビ']
    },
    {
        id: 16,
        name: '豚の生姜焼き&鶏から丼（特盛）',
        shortName: '生姜焼き&鶏から丼 特盛',
        category: '鶏系&豚系丼',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: '豚の生姜焼きと鶏の唐揚げが両方楽しめる欲張り丼の特盛サイズです。',
        image: '/images/denden/mix_gingerpork_chickenkara_large.jpg',
        model: '/models/denden/mix_gingerpork_chickenkara_large_raw.glb',
        serving: '特盛',
        part: '豚肉・鶏肉',
        origin: null,
        recommended: 'そのまま',
        tags: ['生姜焼き', '鶏から', '特盛']
    },

    // === その他 ===
    {
        id: 17,
        name: 'でんでん特製オムライス',
        shortName: '特製オムライス',
        category: 'その他',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'でんでん特製のふわとろオムライスです。',
        image: '/images/denden/omurice_special.jpg',
        model: '/models/denden/other_omurice_special_normal_raw.glb',
        serving: '通常',
        part: null,
        origin: null,
        recommended: 'そのまま',
        tags: ['オムライス', 'ふわとろ', '特製']
    },
    {
        id: 18,
        name: 'オリジナルソースカツ丼',
        shortName: 'ソースカツ丼',
        category: 'その他',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'オリジナルソースで味付けしたカツ丼です。',
        image: '/images/denden/sauce_katsudon.jpg',
        model: '/models/denden/other_sauce_katsudon_normal_raw.glb',
        serving: '通常',
        part: '豚ロース',
        origin: null,
        recommended: 'そのまま',
        tags: ['ソースカツ丼', 'オリジナル', '人気']
    },
    {
        id: 19,
        name: 'でんでん風タコライス',
        shortName: 'タコライス',
        category: 'その他',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'でんでん風にアレンジしたタコライスです。',
        image: '/images/denden/tacorice.jpg',
        model: '/models/denden/other_tacorice_normal_raw.glb',
        serving: '通常',
        part: null,
        origin: null,
        recommended: 'そのまま',
        tags: ['タコライス', 'メキシカン', 'アレンジ']
    },
    {
        id: 20,
        name: 'ロコモコ丼',
        shortName: 'ロコモコ丼',
        category: 'その他',
        price: '--- (税込 ---)',
        minPrice: '---',
        description: 'ハンバーグと目玉焼きをのせたハワイアンスタイルの丼です。',
        image: '/images/denden/locomoco.jpg',
        model: '/models/denden/other_locomoco_normal_raw.glb',
        serving: '通常',
        part: null,
        origin: null,
        recommended: 'そのまま',
        tags: ['ロコモコ', 'ハンバーグ', 'ハワイアン']
    },
];

export default productModels;