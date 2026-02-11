# 新規店舗追加ガイド

このドキュメントでは、food-in-3d プロジェクトに新しい店舗を追加する手順を説明します。

---

## チェックリスト

以下がすべて完了すれば、新規店舗の追加は完了です。

- [ ] **Step 1:** アセットの準備（3Dモデル、画像、HDR、ロゴ）
- [ ] **Step 2:** メニューデータの作成（`src/data/{store_name}/MenuInfo.ts`）
- [ ] **Step 3:** 翻訳データの作成（`src/data/{store_name}/translations/`）
- [ ] **Step 4:** 店舗情報の登録（`src/data/storeInfo.ts`）
- [ ] **Step 5:** メニューマッピングの登録（`src/data/storeMenus.ts`）
- [ ] **Step 6:** 動作確認

---

## 関連するディレクトリ構成

新規店舗 `{store_name}` を追加する場合に作成・編集するファイルの全体像です。

```
food-in-3d/
├── public/
│   ├── models/{store_name}/        # [作成] 3Dモデル (.glb)
│   ├── images/{store_name}/        # [作成] 商品画像 (.jpg/.png)
│   ├── hdr/{store_name}/           # [作成] HDR環境マップ (.hdr)
│   └── thumb/{store_name}/         # [作成] ロゴ・プロモーション画像 (.png)
│
└── src/
    └── data/
        ├── storeInfo.ts            # [編集] 店舗情報を追加
        ├── storeMenus.ts           # [編集] メニューマッピングを追加
        ├── types.ts                # (参照のみ) 型定義
        └── {store_name}/           # [作成] 店舗データディレクトリ
            ├── MenuInfo.ts         # [作成] カテゴリ・商品定義
            └── translations/       # [作成] 翻訳データ
                ├── index.ts
                ├── en.ts
                ├── zh.ts
                └── ko.ts
```

> **ルーティングやホームページの変更は不要です。**
> `storeInfo.ts` に店舗を追加すると、`src/lib/storeParams.ts` が自動的にルートを生成し、
> ホームページ (`src/app/[locale]/(tw)/page.tsx`) の店舗一覧にも自動で表示されます。

---

## Step 1: アセットの準備

店舗に必要なアセットを準備し、`public/` 以下に配置します。

### 1-1. 3Dモデル

| 項目 | 内容 |
|------|------|
| 配置先 | `public/models/{store_name}/` |
| 形式 | GLB (GLTF Binary) |
| 命名規則 | `{商品名}_comp.glb`（例: `chicken_combo_large_comp.glb`） |

- 各商品に対応する3Dモデルファイルを配置します
- モデルのパスは後ほど `MenuInfo.ts` の `model` フィールドで参照します

### 1-2. 商品画像

| 項目 | 内容 |
|------|------|
| 配置先 | `public/images/{store_name}/` |
| 形式 | JPG または PNG |
| 用途 | メニュー一覧のサムネイル |

- 各商品に対応する画像を配置します
- 画像のパスは `MenuInfo.ts` の `image` フィールドで参照します

### 1-3. HDR 環境マップ

| 項目 | 内容 |
|------|------|
| 配置先 | `public/hdr/{store_name}/` |
| 形式 | HDR (High Dynamic Range) |
| 用途 | 3Dビューアのライティング・反射表現 |

- 店舗ごとに1つのHDRファイルが必要です
- `storeInfo.ts` の `firstEnvironment.hdrPath` / `hdrFile` で参照します

### 1-4. ロゴ・プロモーション画像

| 項目 | 内容 |
|------|------|
| 配置先 | `public/thumb/{store_name}/` |
| 形式 | PNG（透過背景推奨） |

必要なファイル:
- **ロゴ画像**（必須）: スタートパネルに表示されます
- **プロモーション画像**（任意）: スタートパネルの右上・左下に表示される商品画像
  - 不要な場合は `storeInfo.ts` で `null` を指定します

---

## Step 2: メニューデータの作成

`src/data/{store_name}/MenuInfo.ts` を作成します。
既存の `src/data/kaishu/MenuInfo.ts` をコピーしてテンプレートにすると効率的です。

### 2-1. カテゴリ定義

```typescript
import type { Category, ProductModelsProps } from '../types';

export const categories: Category[] = [
    {
        id: 1,                          // 一意のID（翻訳ファイルと対応させる）
        name: 'メインメニュー',           // 日本語のカテゴリ名
        count: 5,                       // カテゴリ内の商品数
        description: 'カテゴリの説明文'   // 日本語の説明
    },
    // ... 必要なカテゴリ分追加
];
```

### 2-2. カテゴリ名配列

```typescript
// categories の name と同じ順序で並べる
export const productCategory: string[] = [
    'メインメニュー',
    'サイドメニュー',
    // ...
];
```

### 2-3. 商品定義

```typescript
export const productModels: ProductModelsProps = [
    {
        id: 1,                                              // 一意のID（翻訳ファイルと対応させる）
        name: '商品名',                                      // 日本語の商品名
        shortName: '短縮名',                                  // メニュー一覧での短い表示名
        category: 'メインメニュー',                            // 所属カテゴリ（categories の name と一致させる）
        price: '1,000 (税込 1,100)',                          // 表示用価格
        minPrice: '1,000',                                   // ソート・フィルタ用の最低価格
        description: '商品の詳細な説明文',                      // 日本語の説明
        minDetail: '商品の短い紹介文',                          // 省略時の短い説明（任意）
        image: '/images/{store_name}/product.jpg',            // 商品画像パス
        model: '/models/{store_name}/product_comp.glb',       // 3Dモデルパス
        serving: '1人前',                                     // 量・サービング
        part: '素材・部位',                                    // 素材情報（不要なら null）
        origin: null,                                         // 産地（不要なら null）
        recPeople: 'おすすめの方',                              // おすすめ対象（任意、不要なら null）
        recommended: 'おすすめの食べ方',                         // おすすめの食べ方
        tags: ['タグ1', 'タグ2']                               // 検索・表示用タグ
    },
    // ... 全商品分追加
];
```

> **注意:** `id` は商品ごとに一意にし、翻訳ファイルのキーと一致させてください。

---

## Step 3: 翻訳データの作成

`src/data/{store_name}/translations/` ディレクトリを作成し、以下4ファイルを配置します。
既存の `src/data/kaishu/translations/` をコピーしてテンプレートにしてください。

> **日本語 (ja) の翻訳ファイルは不要です。**
> 日本語データは `MenuInfo.ts` の値がそのまま使われます。

### 3-1. `index.ts`（エントリポイント）

```typescript
import type { StoreTranslations } from '../../types';
import { en } from './en';
import { zh } from './zh';
import { ko } from './ko';

export const translations: Record<string, StoreTranslations> = {
    en,
    zh,
    ko,
};

export default translations;
```

### 3-2. 各言語ファイル（`en.ts` / `zh.ts` / `ko.ts`）

```typescript
import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    // カテゴリ翻訳（id は MenuInfo.ts の categories.id と対応）
    categories: {
        1: { name: 'Main Menu', description: 'Category description' },
        2: { name: 'Side Menu', description: 'Category description' },
        // ...
    },
    // 商品翻訳（id は MenuInfo.ts の productModels.id と対応）
    products: {
        1: {
            name: 'Product Name',
            shortName: 'Short Name',
            description: 'Product description',
            minDetail: 'Brief detail',
            serving: '1 serving',
            part: 'Ingredient/part',
            origin: null,
            recPeople: 'Recommended for...',
            recommended: 'How to eat',
            tags: ['tag1', 'tag2']
        },
        // ... 全商品分
    }
};
```

> **重要:** `categories` と `products` のキー (数値ID) は `MenuInfo.ts` で定義した `id` と正確に一致させてください。
> 不一致があるとその商品・カテゴリの翻訳が適用されません。

---

## Step 4: 店舗情報の登録

`src/data/storeInfo.ts` の `storeInfo` 配列に新しいオブジェクトを追加します。

```typescript
{
    id: 3,                              // 既存店舗と重複しない一意のID
    use_name: 'newstore',               // URLスラッグ（小文字英数字のみ）
    true_name: '新しいお店',              // 画面に表示される店舗名
    logo: 'logo.png',                   // public/thumb/{store_name}/ 内のロゴファイル名
    right_top: 'promo_right.png',       // スタートパネル右上画像（不要なら null）
    left_bottom: 'promo_left.png',      // スタートパネル左下画像（不要なら null）
    menuDisplayMode: 'standard',        // 'standard'（通常）または 'compact'（コンパクト）
    firstEnvironment: {
        hdrPath: '/hdr/newstore/',      // HDRファイルのディレクトリパス
        hdrFile: 'environment.hdr',     // HDRファイル名
        defaultModel: {                 // 初回表示時のデフォルト商品
            name: 'デフォルト商品名',
            path: '/models/newstore/default_comp.glb',
            detail: 'デフォルト商品の説明',
            price: '税込み:1,000',
        },
        modelDisplaySettings: {         // 3D表示の調整値
            scale: 1,                   // 基本スケール
            scaleARjs: 0.09,            // AR.js用スケール
            scaleWebXR: 0.0085,         // WebXR用スケール
            scale3DViewer: 1,           // 3Dビューア用スケール
            detailPosition: [2, 6, -7], // 詳細パネルの3D空間での位置 [x, y, z]
            detailCenter: [0, 0.8],     // 詳細パネルの中心点 [x, y]
        },
        cameraPosition: [17, 42, 36],   // 初期カメラ位置 [x, y, z]
        lightIntensity: 1,              // ライトの強さ
    }
},
```

### パラメータ調整のヒント

| パラメータ | 説明 | 調整方法 |
|-----------|------|---------|
| `scaleARjs` | AR.js でのモデルサイズ | 小さい値 = 小さく表示（kaishu: 0.09、denden: 7） |
| `scaleWebXR` | WebXR でのモデルサイズ | 小さい値 = 小さく表示（kaishu: 0.0085、denden: 0.7） |
| `cameraPosition` | 初期カメラ位置 | 値が大きいほどモデルから遠い |
| `lightIntensity` | ライトの強さ | 1〜2 程度。HDRによって調整 |
| `menuDisplayMode` | メニューの表示形式 | `'standard'`: カテゴリタブ付き通常メニュー、`'compact'`: 横スクロール式コンパクトメニュー |

> **注意:** スケール値は店舗ごとの3Dモデルのサイズによって大きく異なります。
> 実際のビューアで確認しながら調整してください。

---

## Step 5: メニューマッピングの登録

`src/data/storeMenus.ts` を編集して、新規店舗のデータを登録します。

### 5-1. import 文を追加

```typescript
// ファイル上部に追加
import { productModels as newstoreModels, productCategory as newstoreCategory, categories as newstoreCategories } from './{store_name}/MenuInfo';
import newstoreTranslations from './{store_name}/translations';
```

### 5-2. `storeMenuMap` にエントリを追加

```typescript
export const storeMenuMap: Record<string, StoreMenu> = {
    denden: { ... },
    kaishu: { ... },
    // ↓ 追加
    newstore: {
        productModels: newstoreModels,
        productCategory: newstoreCategory,
        jaProductCategory: newstoreCategory,  // 日本語カテゴリ（フィルタリング用）
        categories: newstoreCategories
    },
};
```

### 5-3. `storeTranslationsMap` にエントリを追加

```typescript
export const storeTranslationsMap: Record<string, Record<string, StoreTranslations>> = {
    kaishu: kaishuTranslations,
    denden: dendenTranslations,
    // ↓ 追加
    newstore: newstoreTranslations,
};
```

---

## Step 6: 動作確認

### 6-1. 開発サーバーでの確認

```bash
npm run dev
```

以下のURLにアクセスして各画面が正常に表示されるか確認します。

| URL | 画面 |
|-----|------|
| `/ja/{store_name}` | ランディングページ（スタートパネル） |
| `/ja/{store_name}/viewer` | 3Dビューア |
| `/ja/{store_name}/arView` | WebXR AR |
| `/ja/{store_name}/arJS` | AR.js（マーカーベースAR） |

### 6-2. 多言語の確認

各ロケールでアクセスし、翻訳が正しく適用されているか確認します。

- `/ja/{store_name}` - 日本語
- `/en/{store_name}` - 英語
- `/zh/{store_name}` - 中国語
- `/ko/{store_name}` - 韓国語

### 6-3. 3Dモデルの表示確認

- モデルが正しく読み込まれるか
- スケールが適切か（大きすぎ・小さすぎないか）
- ライティングが自然か
- 詳細パネルの位置が適切か

### 6-4. ビルド確認

```bash
npm run build
```

- ビルドエラーが発生しないこと
- 静的エクスポートで全ルートが生成されること

---

## 参考: 変更ファイル一覧

| ファイル | 操作 | 内容 |
|---------|------|------|
| `public/models/{store_name}/*.glb` | 新規作成 | 3Dモデルファイル |
| `public/images/{store_name}/*.jpg` | 新規作成 | 商品サムネイル画像 |
| `public/hdr/{store_name}/*.hdr` | 新規作成 | HDR環境マップ |
| `public/thumb/{store_name}/*.png` | 新規作成 | ロゴ・プロモーション画像 |
| `src/data/{store_name}/MenuInfo.ts` | 新規作成 | カテゴリ・商品データ定義 |
| `src/data/{store_name}/translations/index.ts` | 新規作成 | 翻訳エントリポイント |
| `src/data/{store_name}/translations/en.ts` | 新規作成 | 英語翻訳 |
| `src/data/{store_name}/translations/zh.ts` | 新規作成 | 中国語翻訳 |
| `src/data/{store_name}/translations/ko.ts` | 新規作成 | 韓国語翻訳 |
| `src/data/storeInfo.ts` | 編集 | 店舗情報オブジェクトを配列に追加 |
| `src/data/storeMenus.ts` | 編集 | import + マッピング2箇所を追加 |

---

## よくある注意点

1. **`use_name` は小文字英数字のみ** - URLスラッグとして使われるため、スペースや日本語は使えません
2. **`id` の重複禁止** - 店舗ID、カテゴリID、商品IDはそれぞれの範囲内で一意にしてください
3. **翻訳IDの対応** - `MenuInfo.ts` の `categories[].id` / `productModels[].id` と翻訳ファイルのキーは正確に一致させてください
4. **ホームページの変更は不要** - `src/app/[locale]/(tw)/page.tsx` は `storeInfo.ts` を参照して自動的に店舗一覧を生成します
5. **ルーティングの変更は不要** - `src/lib/storeParams.ts` が `storeInfo.ts` から自動的に全ルートを生成します
6. **`category` フィールドの一致** - 商品の `category` 値は `categories` で定義した `name` と完全一致させてください
