'use client';
import styled from "styled-components";

import React from "react";
import type { ProductModel } from "@/data/types";
import { useTranslations } from 'next-intl';

type BottomProps = {
    currentProduct: ProductModel;
    sheetExpanded: boolean;
    setSheetExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    onPeekHeightChange?: (height: number) => void;
}

export default function BottomSheet({currentProduct, sheetExpanded, setSheetExpanded, onPeekHeightChange}: BottomProps) {
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const peekRef = React.useRef<HTMLDivElement | null>(null);
    const [peekHeight, setPeekHeight] = React.useState(0);
    const [isFull, setIsFull] = React.useState(false);
    // 閉じるアニメーション中もコンテンツを保持するための遅延フラグ
    const [contentVisible, setContentVisible] = React.useState(false);
    const t = useTranslations('product');

    // 外部から閉じられたときにフル状態もリセット
    React.useEffect(() => {
        if (!sheetExpanded) setIsFull(false);
    }, [sheetExpanded]);

    // sheetExpanded が false になっても 300ms はコンテンツを保持（閉じるアニメーション用）
    React.useEffect(() => {
        if (sheetExpanded) {
            setContentVisible(true);
        } else {
            const timer = setTimeout(() => setContentVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [sheetExpanded]);

    // peekコンテンツの高さを計測し、親に通知
    React.useEffect(() => {
        if (!peekRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                setPeekHeight(height);
                onPeekHeightChange?.(height);
            }
        });
        observer.observe(peekRef.current);
        return () => observer.disconnect();
    }, [onPeekHeightChange]);

    // スワイプ用state
    // numberまたはnullのみを格納できるref
    const touchStartY = React.useRef<number | null>(null);
    const touchEndY = React.useRef<number | null>(null);

    // スワイプ開始
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    // スワイプ終了
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndY.current = e.changedTouches[0].clientY;
        if (touchStartY.current !== null && touchEndY.current !== null) {
            const diff = touchStartY.current - touchEndY.current;
            const isScrolled = contentRef.current ? contentRef.current.scrollTop > 0 : false;

            if (diff > 50) {
                // 上スワイプ: peek→expanded→full と段階的に開く
                if (!sheetExpanded) setSheetExpanded(true);
                else if (!isFull) setIsFull(true);
            } else if (diff < -50 && !isScrolled) {
                // 下スワイプ: full→expanded→peek と段階的に閉じる
                if (isFull) setIsFull(false);
                else if (sheetExpanded) setSheetExpanded(false);
            }
        }
        touchStartY.current = null;
        touchEndY.current = null;
    };

    return(
        <MyTopBar>
            {/* オーバーレイ: 展開時にパネル外タップで完全に閉じる */}
            {sheetExpanded && <div className="sheet-overlay" onClick={() => { setIsFull(false); setSheetExpanded(false); }} />}
            {/* Bottom Sheet */}
            <div
                className={`bottom-sheet ${isFull ? 'full' : sheetExpanded ? 'expanded' : 'peek'}`}
                style={!sheetExpanded && peekHeight > 0 ? { transform: `translateY(calc(100% - ${peekHeight}px))` } : undefined}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div ref={peekRef}>
                    <div className="sheet-handle-area" onClick={() => { if (isFull) setIsFull(false); else setSheetExpanded(!sheetExpanded); }}>
                        <div className="sheet-handle" />
                    </div>
                    <div className="sheet-peek-content" onClick={() => { if (isFull) setIsFull(false); else setSheetExpanded(!sheetExpanded); }}>
                        <h2 className="sheet-title">{currentProduct.name}</h2>
                    </div>
                </div>
                {contentVisible && (
                    <div className="sheet-expanded-content" ref={contentRef}>
                        <div className="sheet-price">¥{currentProduct.price.toLocaleString()}</div>
                        <p className="sheet-description">{currentProduct.description}</p>

                        <div className="sheet-specs">
                            <div className="spec-card">
                                <div className="spec-label">{t('serving')}</div>
                                <div className="spec-value">{currentProduct.serving}</div>
                            </div>
                            {currentProduct.part ?(
                                    <div className="spec-card">
                                        <div className="spec-label">{t('part')}</div>
                                        <div className="spec-value">{currentProduct.part}</div>
                                    </div>
                                ): (
                                    <div className="spec-card">
                                        <div className="spec-label">{t('category')}</div>
                                        <div className="spec-value">{currentProduct.category}</div>
                                    </div>
                                )
                            }
                            {currentProduct.origin ?(
                                    <div className="spec-card">
                                        <div className="spec-label">{t('origin')}</div>
                                        <div className="spec-value">{currentProduct.origin}</div>
                                    </div>
                                ): (
                                    <div className="spec-card">
                                        <div className="spec-label">{t('recommendedFor')}</div>
                                        <div className="spec-value">{currentProduct.recPeople}</div>
                                    </div>
                                )
                            }
                            <div className="spec-card">
                                <div className="spec-label">{t('recommended')}</div>
                                <div className="spec-value">{currentProduct.recommended}</div>
                            </div>
                        </div>

                        <div className="sheet-tags">
                            {currentProduct.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>

                        <div className="sheet-image-wrapper">
                            <img src={currentProduct.image} alt={currentProduct.name} className="sheet-image" />
                        </div>
                    </div>
                )}

                {/* {sheetExpanded && (
                    <div className="sheet-footer">
                        <button className="add-to-cart-button"
                        // onClick={handleAddToCart}
                        >
                            カートに追加   ¥{currentProduct.price.toLocaleString()}
                        </button>
                    </div>
                )} */}
            </div>
        </MyTopBar>
    )
};

const MyTopBar = styled.div`
    /* オーバーレイ */
    .sheet-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 98;
    }

    /* Bottom Sheet */
    .bottom-sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(20px);
        border-radius: 24px 24px 0 0;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 99;
        max-height: 45vh;
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
            max-height: 60vh;
        }
    }

    .bottom-sheet.peek {
        /* transform is set dynamically via inline style */
    }

    .bottom-sheet.expanded {
        transform: translateY(0);
    }

    .bottom-sheet.full {
        transform: translateY(0);
        max-height: 65vh;

        @media (min-width: 768px) {
            max-height: 90vh;
        }
    }

    .sheet-handle-area {
        padding: 12px 0 6px;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }

    .sheet-handle {
        width: 40px;
        height: 4px;
        background: #ddd;
        border-radius: 2px;
    }

    .sheet-peek-content {
        padding: 0 24px 8px;
        flex-shrink: 0;

        @media (min-width: 768px) {
            max-width: 50vw;
            margin: 0 auto;
        }
    }

    .sheet-expanded-content {
        padding: 0 24px;
        overflow-y: auto;
        flex: 1 1 auto;
        -webkit-overflow-scrolling: touch; /* Momentum scrolling on iOS */

        @media (min-width: 768px) {
            max-width: 50vw;
            margin: 0 auto;
            padding: 0 24px;
        }
    }

    .sheet-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 16px;
        text-align: center;
        word-break: keep-all;
        overflow-wrap: break-word;

        @media (min-width: 768px) {
            font-size: 24px;
        }
    }

    .sheet-price {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 16px;

        @media (min-width: 768px) {
            font-size: 32px;
        }
    }

    .sheet-description {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 20px;

        @media (min-width: 768px) {
            font-size: 16px;
        }
    }

    .sheet-specs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
    }

    .spec-card {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 12px;
    }

    .spec-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
    }

    .spec-value {
        font-size: 15px;
        font-weight: 600;
        color: #333;

        @media (min-width: 768px) {
            font-size: 16px;
        }
    }

    .sheet-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .tag {
        padding: 6px 12px;
        background: #f0f0f0;
        border-radius: 12px;
        font-size: 12px;
        color: #666;
    }

    .sheet-image-wrapper {
        margin-top: 20px;
        text-align: center;
    }

    .sheet-image {
        width: 100%;
        max-width: 300px;
        height: auto;
        border-radius: 8px;
        object-fit: cover;
    }

    .sheet-footer {
        position: sticky;
        bottom: 0;
        background: rgba(255,255,255,0.98);
        padding: 16px 44px;
        border-top: 1px solid #eee;
        margin: 0 -24px -24px;
    }

    .add-to-cart-button {
        width: 100%;
        padding: 16px;
        background: #667eea;
        border: none;
        border-radius: 16px;
        color: white;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        min-height: 56px;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        transition: all 0.2s;
    }

    .add-to-cart-button:active {
        transform: scale(0.98);
    }
`