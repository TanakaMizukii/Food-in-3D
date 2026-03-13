import type { Category, ProductModelsProps } from '../types';

export const categories: Category[] = [
    {
        id: 1,
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
    'マンスリーメニュー',
    '店主のおすすめ',
];

// 商品とモデルの関連付け
export const productModels: ProductModelsProps = [
    {
        id: 1,
        name: 'フライドチキンバーガー　自家製食べるラー油仕立て',
        shortName: '３月のマンスリーバーガー',
        category: 'マンスリーメニュー',
        price: '2,150',
        minPrice: '2,150',
        description: 'クリスピーに揚げたフライドチキンに、自家製の食べるラー油をたっぷりと重ねた食べ応えのある最高の一品！\nピリ辛の旨味と香ばしいチキンの食感が絶妙に絡み合う、3月限定のマンスリーバーガーです。',
        minDetail: 'ピリ辛ラー油×サクサクチキン!',
        image: '/images/theSourceDiner/3月マンスリーバーガー.jpg',
        model: '/models/theSourceDiner/burger_monthly_mar_joint_std_video_comp.glb',
        serving: '1人前',
        part: 'フライドチキン・自家製食べるラー油',
        origin: null,
        recPeople: 'ピリ辛×チキンが\n好きな方',
        recommended: '自家製食べるラー油',
        tags: ['ピリ辛', 'フライドチキン', '食べるラー油', '期間限定']
    },
    {
        id: 2,
        name: '春野菜のクリームチャウダー風　クリームソースフィットチーネ',
        shortName: '３月のマンスリーパスタ',
        category: 'マンスリーメニュー',
        price: '1,760',
        minPrice: '1,760',
        description: '旬の春野菜をたっぷり使ったクリームチャウダー風の濃厚ソースが、もちもちのフィットチーネに絡み合う至高のパスタ！\n野菜の甘みとクリーミーなソースのハーモニーをお楽しみください。',
        minDetail: '春野菜×濃厚クリームソース!',
        image: '/images/theSourceDiner/3月マンスリーパスタ.jpg',
        model: '/models/theSourceDiner/pasta_monthly_mar_set_std_video_comp2.glb',
        serving: '1人前',
        part: '春野菜・フィットチーネ',
        origin: null,
        recPeople: '春野菜やクリーム系\nパスタが好きな方',
        recommended: 'パルメザンチーズ',
        tags: ['春野菜', 'クリーム', 'パスタ', '期間限定']
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