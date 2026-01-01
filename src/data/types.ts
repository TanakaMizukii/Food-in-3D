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

// モデル表示設定
export type ModelDisplaySettings = {
    scale: number;                      // モデルのスケール（後方互換性のため残す）
    scaleARjs?: number;                 // ARjs用スケール
    scaleWebXR?: number;                // WebXR用スケール
    scale3DViewer?: number;             // 3DViewer用スケール
    detailPosition: [number, number, number];  // 詳細情報の位置 [x, y, z]
    detailCenter: [number, number];     // 詳細情報の中心 [x, y]
};

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
    modelDisplaySettings?: ModelDisplaySettings;  // モデル表示設定（オプション）
    cameraPosition?: [number, number, number];    // カメラ位置 [x, y, z]
    lightIntensity?: number;                      // ライトの強さ
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