'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../App.css';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import TopAppBar from '@/components/Viewer/TopAppBar';
import CategoryCarousel from '@/components/Viewer/CategoryCarousel';
import NavArrows from '@/components/Viewer/NavArrows';
import SpecificPanels from '@/components/Viewer/SpecificPanels';
import BottomSheet from '@/components/Viewer/BottomSheet';
import PrimaryFab from '@/components/Viewer/PrimaryFab';
import LoadingPanel from '@/components/LoadingPanel';

import type { ProductModel } from '@/data/types';
import SideSlidePanel from '@/components/Viewer/SideSlidePanel';
import TutorialOverlay from '@/components/TutorialOverlay';
import ThreeMain from '@/features/3DViewer/ThreeMain';
import { catchParentPathName } from '@/lib/catchPathname';
import { getStoreMenu } from '@/data/storeMenus';
import { findStoreBySlug } from '@/data/storeInfo';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function ViewerPage() {
    const nowStore = catchParentPathName();
    const storeMenu = getStoreMenu(nowStore);
    const storeInfo = findStoreBySlug(nowStore);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCategory, setCurrentCategory] = useState(1);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);

    const currentProduct: ProductModel = storeMenu.productModels[currentIndex]

    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });

    const wrappedChangeModel: ChangeModelFn = async (info) => {
        setMenuOpen(false);
        await changeModel(info);
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowTutorial(false),100000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <TutorialOverlay isVisible={showTutorial} onClose={() => setShowTutorial(false)}/>
        <LoadingPanel isVisible={loading} />
        <ModelChangeContext.Provider value={{ changeModel: wrappedChangeModel }}>
            <Root>
                <SceneLayer>
                    <ThreeMain setChangeModel={setChangeModel} onLoadingChange={setLoading} storeInfo={storeInfo} />
                </SceneLayer>

                <TopLayer>
                    <TopAppBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} storeName={storeInfo?.true_name}/>
                    <CategoryCarousel currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} categories={storeMenu.categories}/>
                    <PrimaryFab />
                </TopLayer>

                <BottomLayer>
                    <SideSlidePanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} productModels={storeMenu.productModels}/>
                    <NavArrows currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} productModels={storeMenu.productModels}/>
                    <SpecificPanels currentIndex={currentIndex} currentCategory={currentCategory} setCurrentIndex={setCurrentIndex} categories={storeMenu.categories} productModels={storeMenu.productModels}/>
                    <BottomSheet currentProduct={currentProduct}/>
                </BottomLayer>
            </Root>
        </ModelChangeContext.Provider>
        </>
    );
}

const Root = styled.div`
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
`;

const SceneLayer = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
`;

const TopLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    pointer-events: auto;
    & > * { pointer-events: auto; }
`;

const BottomLayer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    pointer-events: auto;
    & > * { pointer-events: auto; }
`;
