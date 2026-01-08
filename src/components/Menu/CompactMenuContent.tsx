import styled from "styled-components";
import MenuCategory from "./MenuCategory";
import CompactMenuItem, { type GroupedProduct } from "./CompactMenuItem";
import type { ProductModelsProps, ProductModel } from "@/data/types";
import React from "react";

type CompactMenuContentProps = {
    className?: string;
    nowCategoryIndex: number;
    models: ProductModelsProps;
    jaCategories: string[]; // 日本語のカテゴリ名（フィルタリング用）
    translatedCategories: string[]; // 翻訳されたカテゴリ名（表示用）
    viewer?: boolean;
};

// 商品名からサイズ情報を取り除いて基本名を取得する関数
function getBaseName(name: string): string {
    // 「（通常）」「（特盛）」「（超大盛り）」などのパターンを除去
    return name.replace(/（[^）]+）$/, '').trim();
}

// 商品をグループ化する関数
function groupProductsByBaseName(products: ProductModel[]): GroupedProduct[] {
    const groupMap = new Map<string, GroupedProduct>();

    products.forEach((product) => {
        const baseName = getBaseName(product.name);

        if (groupMap.has(baseName)) {
            // 既存のグループにバリアントを追加
            groupMap.get(baseName)!.variants.push(product);
        } else {
            // 新しいグループを作成
            groupMap.set(baseName, {
                baseName,
                image: product.image,
                description: product.description,
                category: product.category,
                variants: [product],
            });
        }
    });

    // バリアントを価格順（安い順）にソート
    groupMap.forEach((group) => {
        group.variants.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    });

    return Array.from(groupMap.values());
}

export default function CompactMenuContent({ className, nowCategoryIndex, models, jaCategories, translatedCategories }: CompactMenuContentProps) {
    // modelsからユニークなカテゴリを取得（出現順を維持）
    const allJaCategories = [...new Set(models.map(m => m.category))];

    // 表示するカテゴリを決定（インデックス0は全カテゴリ、それ以外は該当カテゴリのみ）
    // jaCategoriesのインデックスとtranslatedCategoriesのインデックスを使用
    let categoriesToShow: { ja: string; translated: string }[];
    if (nowCategoryIndex === 0) {
        // メインメニュー（最初のタブ）は全カテゴリを表示
        // allJaCategoriesの順序に合わせて翻訳名を取得
        categoriesToShow = allJaCategories.map(jaCat => {
            const idx = jaCategories.indexOf(jaCat);
            return {
                ja: jaCat,
                translated: idx !== -1 ? translatedCategories[idx] : jaCat
            };
        });
    } else {
        // 日本語のカテゴリ名を使用してフィルタリング
        const targetJaCategory = jaCategories[nowCategoryIndex];
        const targetTranslatedCategory = translatedCategories[nowCategoryIndex];
        categoriesToShow = targetJaCategory ? [{ ja: targetJaCategory, translated: targetTranslatedCategory || targetJaCategory }] : [];
    }

    return (
        <div className={className}>
            {categoriesToShow.map((cat) => {
                // カテゴリに属する商品を取得
                const categoryProducts = models.filter(m => m.category === cat.ja);
                // 商品をグループ化
                const groupedProducts = groupProductsByBaseName(categoryProducts);

                return (
                    <React.Fragment key={cat.ja}>
                        <MenuCategory category={cat.translated} />
                        {groupedProducts.map((group) => (
                            <CompactMenuItem key={group.baseName} groupedProduct={group} />
                        ))}
                    </React.Fragment>
                );
            })}
            <SizeNotice>
                ※ここに表示されているサイズは撮影を行った商品のみになります。表示がなくても特盛や超大盛りのご注文は可能です！
            </SizeNotice>
        </div>
    );
}

export const MyCompactContent = styled(CompactMenuContent)`
    padding: 5px 15px 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: ${({ viewer }) => (viewer ? '100dvh' : '70dvh')};
    overflow-y: auto;
`;

// サイズに関する注意書き
const SizeNotice = styled.div`
    padding: 16px 20px;
    font-size: 12px;
    color: #888;
    text-align: center;
    line-height: 1.5;
`;
