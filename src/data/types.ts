export interface Category {
    id: number;
    name: string;
    count: number;
    description: string;
}

export type ProductModel = {
    id: number;
    name: string;
    shortName: string;
    category: string;
    price: string;
    minPrice: string;
    description: string;
    image: string;
    model: string;
    minDetail?: string;
    serving: string;
    part: string | null;
    origin: string | null;
    recPeople?: string | null;
    recommended: string;
    tags: string[];
};

// 配列型
export type ProductModelsProps = ProductModel[];

// 店舗環境設定
export type FirstEnvironment = {
    hdrPath: string;        // 環境マップのパス (例: '/hdr/kaishu/')
    hdrFile: string;        // HDRファイル名 (例: 'kaishu_env.hdr')
    defaultModel: {
        name: string;
        path: string;
        detail: string;
        price: string;
    };
};

export type StoreInfo = {
    id: number,
    use_name: string,
    true_name: string,
    logo?: string,
    right_top?: string | null,
    left_bottom?: string | null,
    firstEnvironment?: FirstEnvironment,
}