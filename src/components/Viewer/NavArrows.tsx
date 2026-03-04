import styled from "styled-components";

import { useContext } from 'react';
import { ModelChangeContext } from "../../contexts/ModelChangeContext";
import type { Category, ProductModelsProps } from "@/data/types";

type ArrowsProps = {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    productModels: ProductModelsProps;
    currentCategory: number;
    categories: Category[];
    productCategory: string[];
}

export default function NavArrows({currentIndex, setCurrentIndex, productModels, currentCategory, categories, productCategory}: ArrowsProps) {
    const { changeModel } = useContext(ModelChangeContext);

    const currentCategoryIndex = categories.findIndex(c => c.id === currentCategory);
    const currentJapaneseCategoryName = productCategory[currentCategoryIndex];

    const variants = productModels.map((m, i) => ({ model: m, i }))
        .filter(({ model }) => {
            if (currentCategory === 1) return true;
            return model.category === currentJapaneseCategoryName;
        });

    const currentVariantIndex = variants.findIndex(v => v.i === currentIndex);
    const prevVariant = currentVariantIndex > 0 ? variants[currentVariantIndex - 1] : null;
    const nextVariant = currentVariantIndex < variants.length - 1 ? variants[currentVariantIndex + 1] : null;

    const handleBack = () => {
        if (!prevVariant) return;
        setCurrentIndex(prevVariant.i);
        const model = prevVariant.model;
        changeModel({ modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price });
    };

    const handleGo = () => {
        if (!nextVariant) return;
        setCurrentIndex(nextVariant.i);
        const model = nextVariant.model;
        changeModel({ modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price });
    };

    return(
        <MyNavArrows>
            {/* Navigation Arrows */}
            <div className="nav-arrows">
                <button
                    className="nav-arrow"
                    onClick={handleBack}
                    disabled={!prevVariant}
                >
                    ◀
                </button>
                <button
                    className="nav-arrow"
                    onClick={handleGo}
                    disabled={!nextVariant}
                >
                    ▶
                </button>
            </div>
        </MyNavArrows>
    )
};

const MyNavArrows = styled.div`
        /* Navigation Arrows */
        .nav-arrows {
            position: absolute;
            bottom: 40vh;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 12px;
            pointer-events: none;
            z-index: 85;

            @media (min-width: 768px) {
                padding: 0 10vw;
            }
        }

        .nav-arrow {
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 50%;
            color: rgba(255,255,255,0.8);
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: all;
            cursor: pointer;
            transition: all 0.2s;
        }

        .nav-arrow:active {
            background: rgba(0,0,0,0.7);
            transform: scale(0.95);
        }

        .nav-arrow:disabled {
            opacity: 0.2;
            cursor: not-allowed;
        }
`
