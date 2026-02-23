import styled from "styled-components";

import React, { useContext, useRef, useEffect, useCallback } from 'react';
import { ModelChangeContext } from "../../contexts/ModelChangeContext";
import type { Category, ProductModel, ProductModelsProps } from "@/data/types";

type SpecificProps = {
    currentIndex: number;
    currentCategory: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    categories: Category[];
    productModels: ProductModelsProps;
    productCategory: string[]; // 日本語のカテゴリ名リスト（商品のcategoryフィールドとマッチング用）
    peekHeight?: number;
}

export default function SpecificPanels({currentIndex, currentCategory, setCurrentIndex, categories, productModels, productCategory, peekHeight }: SpecificProps) {

    const currentProduct: ProductModel = productModels[currentIndex]

    const { changeModel } = useContext(ModelChangeContext);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chipRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const prevCategoryRef = useRef(currentCategory);
    const isUserScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleVariantChange = useCallback((index: number, model: ProductModel) => {
        setCurrentIndex(index);
        changeModel({modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price});
    }, [setCurrentIndex, changeModel]);

    // 現在のカテゴリIDに対応する日本語カテゴリ名を取得
    const currentCategoryIndex = categories.findIndex(c => c.id === currentCategory);
    const currentJapaneseCategoryName = productCategory[currentCategoryIndex];

    const variants = productModels.map((m, i) => ({model: m, i}))
        .filter(({ model }) => {
            if (currentCategory === 1) {
                return true;
            }
            return model.category === currentJapaneseCategoryName;
        });

    // 選択中のチップを中央にスクロール
    const scrollToCenter = useCallback((index: number) => {
        const container = scrollRef.current;
        const chip = chipRefs.current.get(index);
        if (!container || !chip) return;

        const containerWidth = container.offsetWidth;
        const chipLeft = chip.offsetLeft;
        const chipWidth = chip.offsetWidth;
        const scrollTo = chipLeft - containerWidth / 2 + chipWidth / 2;
        container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }, []);

    // スクロールで中央のチップを検出して選択
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            isUserScrollingRef.current = true;

            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
            scrollTimerRef.current = setTimeout(() => {
                // スクロール停止後に中央のチップを検出
                const containerRect = container.getBoundingClientRect();
                const centerX = containerRect.left + containerRect.width / 2;

                let closestIndex = -1;
                let closestDistance = Infinity;

                chipRefs.current.forEach((chip, index) => {
                    const chipRect = chip.getBoundingClientRect();
                    const chipCenterX = chipRect.left + chipRect.width / 2;
                    const distance = Math.abs(centerX - chipCenterX);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });

                if (closestIndex !== -1 && closestIndex !== currentIndex) {
                    const variant = variants.find(v => v.i === closestIndex);
                    if (variant) {
                        handleVariantChange(variant.i, variant.model);
                    }
                }

                isUserScrollingRef.current = false;
            }, 150);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    }, [variants, currentIndex, handleVariantChange]);

    // currentIndex が変わったらチップを中央にスクロール（ユーザースクロール以外の場合のみ）
    useEffect(() => {
        if (!isUserScrollingRef.current) {
            scrollToCenter(currentIndex);
        }
    }, [currentIndex, scrollToCenter]);

    // カテゴリ変更後0.5秒動かなければ、そのカテゴリの最初のモデルを自動選択
    useEffect(() => {
        if (prevCategoryRef.current === currentCategory) return;
        prevCategoryRef.current = currentCategory;

        const timer = setTimeout(() => {
            if (variants.length > 0) {
                const first = variants[0];
                handleVariantChange(first.i, first.model);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentCategory, variants, handleVariantChange]);

    return(
        <MySpecific>
            {/* Specific Panels */}
            <div className="variant-chips" ref={scrollRef} style={peekHeight ? { bottom: `${peekHeight + 8}px` } : undefined}>
                <div className="variant-chips-inner">
                    {variants.map(({ model, i }) => (
                        <button
                            key={model.id}
                            ref={(el) => {
                                if (el) chipRefs.current.set(i, el);
                                else chipRefs.current.delete(i);
                            }}
                            className={`variant-chip ${model === currentProduct ? 'active' : ''}`}
                            onClick={() => handleVariantChange(i, model)}
                        >
                            {model.shortName} ¥{model.minPrice.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>
        </MySpecific>
    )
};

const MySpecific = styled.div`
    /* Specific Panels */
    .variant-chips {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 50px;
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-snap-type: x mandatory;
    }

    .variant-chips::-webkit-scrollbar {
        display: none;
    }

    .variant-chips-inner {
        display: inline-flex;
        gap: 8px;
        padding: 4px 0;
        /* 最初と最後のチップが中央に来るようにパディング追加 */
        padding-left: calc(50vw - 60px);
        padding-right: calc(50vw - 60px);
    }

    .variant-chip {
        padding: 10px 20px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 20px;
        color: rgba(255,255,255,1);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        scroll-snap-align: center;
    }

    .variant-chip.active {
        background: #ff4d4d;
        border-color: transparent;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(255, 80, 80, 0.45);
    }
`