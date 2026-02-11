import type { Category, ProductModelsProps } from '../types';

export const categories: Category[] = [
    {
        id: 1,
        name: 'マンスリーメニュー',
        count: 2,
        description: '今月しか楽しめない商品をご覧ください！'
    },
    {
        id: 2,
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
        name: 'チョリソーとモッツァレラのエスニックバーガー',
        shortName: '２月のマンスリーバーガー',
        category: 'マンスリーメニュー',
        price: '2,150',
        minPrice: '2,150',
        description: '特上カルビ・上カルビ・並みカルビ・切り落としカルビがワンプレートでまとめて食べられます！！\nぜひそれぞれのカルビの食べ比べから、味や柔らかさなどをお楽しみください！',
        minDetail: '4種類のカルビを楽しめます!',
        image: '/images/kaishu/カルビ盛り.jpg',
        model: '/models/kaishu/calbee_set_comp.glb',
        serving: '2～3人前',
        part: '牛カルビ（4種類）',
        recPeople: 'カルビの味比べなど\n楽しみたい方',
        origin: null,
        recommended: 'タレ',
        tags: ['カルビ尽くし', '食べ比べ', '4種類', 'おすすめ']
    },
    {
        id: 2,
        name: 'ミートボールサンデーソースフィットチーネ',
        shortName: '２月のマンスリーパスタ',
        category: 'マンスリーメニュー',
        price: '1,760',
        minPrice: '1,760',
        description: '厳選した９種類のホルモンをお楽しみにしていただけます。\nセットの特製塩だれにつけて存分にお楽しみください。',
        image: '/images/kaishu/九種盛り.jpg',
        model: '/models/kaishu/9hormone_set_comp2.glb',
        minDetail: '様々な部位をお楽しみいただけます。',
        serving: '2～3人前',
        part: 'ガツ芯・のどがしら・メンチャン・セセリ・ハチノス・コリコリ・ハツなど',
        origin: null,
        recPeople: '珍しいホルモンを楽しみたい方',
        recommended: '特製塩ダレ',
        tags: ['ホルモン', 'バラエティ', '厳選', '9種類']
    },
    {
        id: 3,
        name: 'ラムダンプリング（マーラーソース）',
        shortName: 'ラムダンプリング',
        category: '店主のおすすめ',
        price: '880',
        minPrice: '880',
        description: '人気なタン・ハラミを始め、並みカルビ・コプチャン・地鶏・ウインナーが特性の味噌ダレ味とセットで存分にお楽しみ頂けます',
        image: '/images/kaishu/ファミリーセット.jpg',
        model: '/models/kaishu/family_s_set_comp2.glb',
        minDetail: '様々なお肉がセットになったお得な一皿！',
        serving: '4～5人前',
        part: 'タン・ハラミ・カルビ・ホルモン・地鶏・ウインナーなど',
        origin: null,
        recPeople: '家族や宴会など、大人数の方',
        recommended: '特性ポン酢ダレ',
        tags: ['ファミリー向け', 'バラエティ', 'お得', 'セット']
    },
    {
        id: 4,
        name: 'チーズバーガー',
        shortName: 'チーズバーガー',
        category: '店主のおすすめ',
        price: '1,870',
        minPrice: '1,870',
        description: 'タンの中でも上質な部分。レモンで食べると程よい油が口の中に広がります。',
        image: '/images/kaishu/上タン塩.jpg',
        model: '/models/kaishu/ton_tongue_comp3.glb',
        serving: '1人前',
        part: 'タン',
        origin: 'オーストラリア産',
        recommended: '塩・レモン',
        tags: ['上質', 'さっぱり', '人気']
    },
];

export default productModels;