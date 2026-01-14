import styled from "styled-components";
import MenuCategory from "./MenuCategory";
import MenuItem from "./MenuItem";
import type { ProductModelsProps } from "@/data/types";
import React from "react";

type MenuContentProps = {
    className?: string;
    nowCategoryIndex: number;
    models: ProductModelsProps;
    jaCategories: string[]; // 日本語のカテゴリ名（フィルタリング用）
    translatedCategories: string[]; // 翻訳されたカテゴリ名（表示用）
    viewer?: boolean;
}

export default function MenuContent({className, nowCategoryIndex, models, jaCategories, translatedCategories}: MenuContentProps) {
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

    return(
        <div className={className}>
            {categoriesToShow.map((cat) => (
                // それぞれのmapにキーを付けて配置
                <React.Fragment key={cat.ja}>
                    <MenuCategory category={cat.translated} />
                    {models.filter(m => m.category === cat.ja)
                        .map((model, idx) => (
                            <MenuItem key={model.name ?? idx} model={model} />
                        ))
                    }
                </React.Fragment>
            ))}
        </div>
    )
}

export const MyContent = styled(MenuContent)`
    padding: 5px 15px 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    height: ${({viewer}) => (viewer ? '100dvh' : '70dvh')};
    overflow-y: auto;
`