import styled from "styled-components";
import MenuCategory from "./MenuCategory";
import MenuItem from "./MenuItem";
import type { ProductModelsProps } from "@/data/types";
import React from "react";

type MenuContentProps = {
    className?: string;
    nowCategory: string;
    models: ProductModelsProps;
    viewer?: boolean;
}

export default function MenuContent({className, nowCategory, models}: MenuContentProps) {
    // modelsからユニークなカテゴリを取得（出現順を維持）
    const allCategories = [...new Set(models.map(m => m.category))];

    // カテゴリーごとの表示設定を動的に生成
    const selectCategory: {[index: string] : string[]}  = {};

    // メインメニューは全カテゴリーを表示
    selectCategory['メインメニュー'] = allCategories;

    // 各カテゴリーは自身のみを表示
    allCategories.forEach(cat => {
        selectCategory[cat] = [cat];
    });

    // まず配列を取り出しておく
    const categories = selectCategory[nowCategory] ?? [];
    return(
        <div className={className}>
            {categories.map((cat) => (
                // それぞれのmapにキーを付けて配置
                <React.Fragment key={cat}>
                    <MenuCategory category={cat} />
                    {models.filter(m => m.category === cat)
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