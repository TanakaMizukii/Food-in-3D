'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { getLocalizedStoreMenu, getLocalizedStoreInfo, getStoreMenu } from '@/data/storeMenus';
import { findStoreBySlug } from '@/data/storeInfo';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

function ViewerPageInner() {
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const storeMenu = getLocalizedStoreMenu(nowStore, locale);
    const storeInfo = findStoreBySlug(nowStore);
    const baseLocalizedStoreInfo = getLocalizedStoreInfo(storeInfo, storeMenu, locale);
    const menuDisplayMode = storeInfo?.menuDisplayMode ?? 'standard';
    const searchParams = useSearchParams();
    const modelIdParam = searchParams.get('model');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const localizedStoreInfo = useMemo((): typeof baseLocalizedStoreInfo => {
        if (!modelIdParam || !baseLocalizedStoreInfo?.firstEnvironment) return baseLocalizedStoreInfo;
        const id = Number(modelIdParam);
        const product = storeMenu.productModels.find(p => p.id === id);
        if (!product) return baseLocalizedStoreInfo;
        return {
            ...baseLocalizedStoreInfo,
            firstEnvironment: {
                ...baseLocalizedStoreInfo.firstEnvironment!,
                defaultModel: {
                    name: product.name,
                    path: product.model,
                    detail: product.description,
                    price: product.price,
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelIdParam]);

    // Find initial index based on URL ?model param, or storeInfo's default model (日本語のベースメニューでマッチ)
    const getInitialIndex = () => {
        if (modelIdParam) {
            const id = Number(modelIdParam);
            const baseMenu = getStoreMenu(nowStore);
            const idx = baseMenu.productModels.findIndex(p => p.id === id);
            if (idx >= 0) return idx;
        }
        if (!storeInfo?.firstEnvironment?.defaultModel) return 0;
        const defaultModelName = storeInfo.firstEnvironment.defaultModel.name;
        const baseMenu = getStoreMenu(nowStore);
        const index = baseMenu.productModels.findIndex(p => p.name === defaultModelName);
        return index >= 0 ? index : 0;
    };

    const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
    const [currentCategory, setCurrentCategory] = useState(storeMenu.categories[0]?.id ?? 1);
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
        if (info.modelName) {
            const baseMenu = getStoreMenu(nowStore);
            const idx = baseMenu.productModels.findIndex(p => p.name === info.modelName);
            if (idx >= 0) setCurrentIndex(idx);
        }
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
                        storeInfo={localizedStoreInfo}
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
                <PrimaryFab onOpenDetail={() => setSheetExpanded(true)} peekHeight={peekHeight} currentModelId={currentProduct?.id} />
            </Root>
        </ModelChangeContext.Provider>
        </>
    );
}

export default function ViewerPage() {
    return (
        <Suspense>
            <ViewerPageInner />
        </Suspense>
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
