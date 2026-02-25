import type { Category, ProductModelsProps } from '../types';

export const categories: Category[] = [
    {
        id: 1,
        name: 'セレクトメニュー',
        count: 2,
        description: '今月しか楽しめない商品をご覧ください！'
    },
    {
        id: 2,
        name: 'マンスリーメニュー',
        count: 2,
        description: '今月しか楽しめない商品をご覧ください！'
    },
    {
        id: 3,
        name: '店主のおすすめ',
        count: 2,
        description: 'おすすめの一品をご覧ください！'
    },
];

export const productCategory: string[] = [
    'セレクトメニュー',
    'マンスリーメニュー',
    '店主のおすすめ',
];

// 商品とモデルの関連付け
export const productModels: ProductModelsProps = [
    {
        id: 1,
        name: 'チョリソーとモッツァレラの エスニックバーガー',
        shortName: '２月のマンスリーバーガー',
        category: 'マンスリーメニュー',
        price: '2,150',
        minPrice: '2,150',
        description: 'スパイシーなチョリソーととろけるモッツァレラチーズが絶妙にマッチしたエスニック風バーガー。\nピリ辛のチョリソーの旨味と、クリーミーなモッツァレラのハーモニーをお楽しみください！',
        minDetail: 'スパイシー×チーズの絶妙コンビ!',
        image: '/images/theSourceDiner/2月マンスリーバーガー (2).jpg',
        model: '/models/theSourceDiner/burger_monthly_feb_set_std_video_comp4.glb',
        serving: '1人前',
        part: 'チョリソー・モッツァレラチーズ',
        recPeople: 'スパイシーな料理が\n好きな方',
        origin: null,
        recommended: 'エスニックソース',
        tags: ['スパイシー', 'エスニック', 'チョリソー', '期間限定']
    },
    {
        id: 2,
        name: 'ミートボールサンデーソース フィットチーネ',
        shortName: '２月のマンスリーパスタ',
        category: 'マンスリーメニュー',
        price: '1,760',
        minPrice: '1,760',
        description: 'ジューシーなミートボールと濃厚なサンデーソースが絡み合うフィットチーネ。\nもちもちの平打ちパスタとボリューム満点のミートボールをお楽しみください。',
        image: '/images/theSourceDiner/2月マンスリーパスタ (3).jpg',
        model: '/models/theSourceDiner/pasta_monthly_feb_set_std_video_comp4.glb',
        minDetail: '濃厚ソース×もちもちパスタ!',
        serving: '1人前',
        part: 'ミートボール・フィットチーネ',
        origin: null,
        recPeople: 'パスタ好きの方',
        recommended: 'パルメザンチーズ',
        tags: ['パスタ', 'ミートボール', '濃厚', '期間限定']
    },
    {
        id: 3,
        name: 'ラムダンプリング（マーラーソース）',
        shortName: 'ラムダンプリング',
        category: '店主のおすすめ',
        price: '880',
        minPrice: '880',
        description: 'ラム肉の旨味がぎゅっと詰まったダンプリングを、痺れるマーラーソースでお楽しみいただけます。\nピリッとした刺激とラムの深い味わいが癖になる一品です。',
        image: '/images/theSourceDiner/ラムダンプリング (5).jpg',
        model: '/models/theSourceDiner/dumpling_mala_set_std_video_comp4.glb',
        minDetail: '痺れる辛さが癖になる!',
        serving: '1人前',
        part: 'ラム肉',
        origin: null,
        recPeople: '辛い料理や\nラム肉が好きな方',
        recommended: 'マーラーソース',
        tags: ['ラム', 'ダンプリング', 'ピリ辛', 'おすすめ']
    },
    {
        id: 4,
        name: 'チーズバーガー',
        shortName: 'チーズバーガー',
        category: '店主のおすすめ',
        price: '1,870',
        minPrice: '1,870',
        description: 'とろけるチーズとジューシーなパティの王道チーズバーガー。\nシンプルながらも素材の美味しさが引き立つ、店主こだわりの一品です。',
        image: '/images/theSourceDiner/チーズバーガー (13).jpg',
        model: '/models/theSourceDiner/dumpling_mala_set_std_video_comp4_non.glb',
        serving: '1人前',
        part: 'ビーフパティ・チーズ',
        origin: null,
        recommended: 'ケチャップ・マスタード',
        tags: ['定番', 'チーズ', 'ジューシー', 'おすすめ']
    },
];

export default productModels;