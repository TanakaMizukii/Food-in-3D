import styled from "styled-components";
import { useContext, useState } from 'react';
import { ModelChangeContext } from "@/contexts/ModelChangeContext";
import { ToggleChangeContext } from "@/contexts/ToggleChangeContext";
import type { ProductModel } from "@/data/types";

// グループ化された商品の型
export type GroupedProduct = {
    baseName: string;           // 基本商品名（サイズ情報を除いた名前）
    image: string;              // 代表画像
    description: string;        // 商品説明
    category: string;           // カテゴリ
    variants: ProductModel[];   // サイズ違いの商品一覧
};

type DendenMenuItemProps = {
    groupedProduct: GroupedProduct;
};

export default function DendenMenuItem({ groupedProduct }: DendenMenuItemProps) {
    const { changeModel } = useContext(ModelChangeContext);
    const { toggleChange } = useContext(ToggleChangeContext);
    const [selectedVariant, setSelectedVariant] = useState<ProductModel | null>(null);

    // 通常サイズ（最初のバリアント＝価格が一番安いもの）を取得
    const normalVariant = groupedProduct.variants[0];

    // パネル全体をクリックした時の処理（通常サイズで表示）
    const handlePanelClick = () => {
        if (typeof changeModel === 'function') {
            changeModel({
                modelName: normalVariant.name,
                modelPath: normalVariant.model,
                modelDetail: normalVariant.description,
                modelPrice: normalVariant.price
            });
        }
        if (typeof toggleChange === 'function') {
            toggleChange();
        }
    };

    // サイズボタンをクリックした時の処理
    const handleSizeClick = (e: React.MouseEvent, variant: ProductModel) => {
        e.stopPropagation(); // パネルクリックイベントを止める
        setSelectedVariant(variant);
        if (typeof changeModel === 'function') {
            changeModel({
                modelName: variant.name,
                modelPath: variant.model,
                modelDetail: variant.description,
                modelPrice: variant.price
            });
        }
        if (typeof toggleChange === 'function') {
            toggleChange();
        }
    };

    // 価格の範囲を表示（最小〜最大）
    const prices = groupedProduct.variants.map(v => parseInt(v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceDisplay = minPrice === maxPrice ? `${minPrice}円` : `${minPrice}円〜${maxPrice}円`;

    return (
        <MyDendenItem>
            <div className="denden-item" onClick={handlePanelClick}>
                {/* 左半分：画像 */}
                <div className="denden-item-image-wrapper">
                    <img
                        src={groupedProduct.image}
                        alt={groupedProduct.baseName}
                        className="denden-item-image"
                    />
                </div>
                {/* 右半分：商品情報とサイズボタン */}
                <div className="denden-item-right">
                    <div className="denden-item-info">
                        <div className="denden-item-title">{groupedProduct.baseName}</div>
                        <div className="denden-item-description">{groupedProduct.description}</div>
                        <div className="denden-item-price">{priceDisplay}</div>
                    </div>
                    <div className="denden-item-sizes">
                        {groupedProduct.variants.map((variant) => (
                            <button
                                key={variant.id}
                                className={`size-btn ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                onClick={(e) => handleSizeClick(e, variant)}
                            >
                                <span className="size-name">{variant.serving}</span>
                                <span className="size-price">{variant.price}円</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MyDendenItem>
    );
}

const MyDendenItem = styled.div`
.denden-item {
    display: flex;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    color: #666;
    cursor: pointer;
    transition: box-shadow 0.2s;
}

.denden-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 左半分：画像 */
.denden-item-image-wrapper {
    flex: 0 0 50%;
    aspect-ratio: 4 / 3;
}

.denden-item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #e0e0e0;
}

/* 右半分：情報とボタン */
.denden-item-right {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.denden-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.denden-item-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #333;
    line-height: 1.3;
}

.denden-item-description {
    font-size: 10px;
    color: #666;
    margin-bottom: 6px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.denden-item-price {
    font-size: 13px;
    font-weight: bold;
    color: #e67e22;
}

/* サイズボタンエリア */
.denden-item-sizes {
    display: flex;
    gap: 4px;
    margin-top: auto;
}

.size-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 4px;
    background-color: #f5f5f5;
    border: 1.5px solid #ddd;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
}

.size-btn:hover {
    background-color: #e8e8e8;
    border-color: #ccc;
}

.size-btn.selected {
    background-color: #333;
    border-color: #333;
    color: #fff;
}

.size-btn.selected .size-name,
.size-btn.selected .size-price {
    color: #fff;
}

.size-name {
    font-size: 10px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
}

.size-price {
    font-size: 9px;
    color: #666;
}
`;
