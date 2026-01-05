import styled from "styled-components";
import MenuCategory from "./MenuCategory";
import CompactMenuItem, { type GroupedProduct } from "./CompactMenuItem";
import type { ProductModelsProps, ProductModel } from "@/data/types";
import React from "react";

type CompactMenuContentProps = {
    className?: string;
    nowCategory: string;
    models: ProductModelsProps;
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

export default function CompactMenuContent({ className, nowCategory, models }: CompactMenuContentProps) {
    // modelsからユニークなカテゴリを取得（出現順を維持）
    const allCategories = [...new Set(models.map(m => m.category))];

    // カテゴリーごとの表示設定を動的に生成
    const selectCategory: { [index: string]: string[] } = {};

    // メインメニューは全カテゴリーを表示
    selectCategory['メインメニュー'] = allCategories;

    // 各カテゴリーは自身のみを表示
    allCategories.forEach(cat => {
        selectCategory[cat] = [cat];
    });

    // まず配列を取り出しておく
    const categories = selectCategory[nowCategory] ?? [];

    return (
        <div className={className}>
            {categories.map((cat) => {
                // カテゴリに属する商品を取得
                const categoryProducts = models.filter(m => m.category === cat);
                // 商品をグループ化
                const groupedProducts = groupProductsByBaseName(categoryProducts);

                return (
                    <React.Fragment key={cat}>
                        <MenuCategory category={cat} />
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
