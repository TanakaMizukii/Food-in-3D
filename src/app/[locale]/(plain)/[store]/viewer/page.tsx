'use client'

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import '../App.css';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import TopAppBar from '@/components/Viewer/TopAppBar';
import CategoryCarousel from '@/components/Viewer/CategoryCarousel';
import NavArrows from '@/components/Viewer/NavArrows';
import SpecificPanels from '@/components/Viewer/SpecificPanels';
import BottomSheet from '@/components/Viewer/BottomSheet';
import PrimaryFab from '@/components/Viewer/PrimaryFab';
import LoadingPanel from '@/components/Common/LoadingPanel';

import type { ProductModel } from '@/data/types';
import SideSlidePanel from '@/components/Viewer/SideSlidePanel';
import TutorialOverlay from '@/components/Viewer/TutorialOverlay';
import ThreeMain from '@/features/3DViewer/ThreeMain';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';
import { getLocalizedStoreMenu } from '@/data/storeMenus';
import { findStoreBySlug } from '@/data/storeInfo';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function ViewerPage() {
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const storeMenu = getLocalizedStoreMenu(nowStore, locale);
    const storeInfo = findStoreBySlug(nowStore);
    const menuDisplayMode = storeInfo?.menuDisplayMode ?? 'standard';

    // Find initial index based on storeInfo's default model
    const getInitialIndex = () => {
        if (!storeInfo?.firstEnvironment?.defaultModel) return 0;
        const defaultModelName = storeInfo.firstEnvironment.defaultModel.name;
        const index = storeMenu.productModels.findIndex(p => p.name === defaultModelName);
        return index >= 0 ? index : 0;
    };

    const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
    const [currentCategory, setCurrentCategory] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState<number | undefined>(undefined);
    const handleLoadingChange = useCallback((loading: boolean) => {
        if (loading) setLoadingProgress(0);
        setLoading(loading);
    }, []);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [sheetExpanded, setSheetExpanded] = useState(false);
    const [peekHeight, setPeekHeight] = useState(0);

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
        {/* <TutorialOverlay isVisible={showTutorial} onClose={() => setShowTutorial(false)}/> */}
        <LoadingPanel isVisible={loading} progress={loadingProgress} />
        <ModelChangeContext.Provider value={{ changeModel: wrappedChangeModel }}>
            <Root>
                <SceneLayer>
                    <ThreeMain
                        setChangeModel={setChangeModel}
                        onLoadingChange={handleLoadingChange}
                        onLoadingProgress={setLoadingProgress}
                        storeInfo={storeInfo}
                    />
                </SceneLayer>

                <TopLayer>
                    <TopAppBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} storeName={storeInfo?.true_name}/>
                    <CategoryCarousel currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} categories={storeMenu.categories}/>
                    <SpecificPanels currentIndex={currentIndex} currentCategory={currentCategory} setCurrentIndex={setCurrentIndex} categories={storeMenu.categories} productModels={storeMenu.productModels} productCategory={storeMenu.jaProductCategory}/>
                </TopLayer>

                <BottomLayer>
                    <SideSlidePanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} productModels={storeMenu.productModels} jaCategories={storeMenu.jaProductCategory} translatedCategories={storeMenu.productCategory} menuDisplayMode={menuDisplayMode}/>
                    <NavArrows currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} productModels={storeMenu.productModels} currentCategory={currentCategory} categories={storeMenu.categories} productCategory={storeMenu.jaProductCategory}/>
                    <BottomSheet currentProduct={currentProduct} sheetExpanded={sheetExpanded} setSheetExpanded={setSheetExpanded} onPeekHeightChange={setPeekHeight}/>
                </BottomLayer>
                {/* BottomLayerの{ pointer-events: auto } に上書きされないようRoot直下に配置。*/}
                <PrimaryFab onOpenDetail={() => setSheetExpanded(true)} peekHeight={peekHeight} />
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
