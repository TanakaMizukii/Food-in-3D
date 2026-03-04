import type { Category, ProductModelsProps } from '../types';

export const categories: Category[] = [
    {
        id: 3,
        name: '店主のおすすめ',
        count: 2,
        description: 'おすすめの一品をご覧ください！'
    },
];

export const productCategory: string[] = [
    '店主のおすすめ',
];

// 商品とモデルの関連付け
export const productModels: ProductModelsProps = [
    {
        id: 4,
        name: 'チーズバーガー',
        shortName: 'チーズバーガー',
        category: '店主のおすすめ',
        price: '1,870',
        minPrice: '1,870',
        description: 'とろけるチーズとジューシーなパティの王道チーズバーガー。\nシンプルながらも素材の美味しさが引き立つ、店主こだわりの一品です。',
        image: '/images/theSourceDiner/チーズバーガー (13).jpg',
        model: '/models/theSourceDiner/burger_cheese_joint_std_video_comp5.glb',
        serving: '1人前',
        part: 'ビーフパティ・チーズ',
        origin: null,
        recPeople: 'たっぷりのチーズとハンバーガーを楽しみたい方',
        recommended: 'ケチャップ・マスタード',
        tags: ['定番', 'チーズ', 'ジューシー', 'おすすめ']
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
        model: '/models/theSourceDiner/dumpling_mala_set_std_video_comp7.glb',
        minDetail: '痺れる辛さが癖になる!',
        serving: '1人前',
        part: 'ラム肉',
        origin: null,
        recPeople: '辛い料理や\nラム肉が好きな方',
        recommended: 'マーラーソース',
        tags: ['ラム', 'ダンプリング', 'ピリ辛', 'おすすめ']
    },
];

export default productModels;