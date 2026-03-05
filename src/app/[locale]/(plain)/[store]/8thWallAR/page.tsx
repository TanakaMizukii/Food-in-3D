'use client'

import '../App.css';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuContainer from '@/components/Menu/MenuContainer';
import CompactMenuContainer from '@/components/Menu/CompactMenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import LoadingPanel from '@/components/Common/LoadingPanel';
import GuideScanPlane from '@/components/AR/GuideScanPlane';
import ThreeMain from '@/features/8thWallAR/ThreeMain';
import { findStoreBySlug } from '@/data/storeInfo';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';
import { getLocalizedStoreMenu, getLocalizedStoreInfo } from '@/data/storeMenus';
import { useTranslations } from 'next-intl';

import type { ModelDisplaySettings } from '@/data/types';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function EightWallARPage() {
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const storeInfo = findStoreBySlug(nowStore);
    const storeMenu = getLocalizedStoreMenu(nowStore, locale);
    const baseLocalizedStoreInfo = getLocalizedStoreInfo(storeInfo, storeMenu, locale);
    const menuDisplayMode = storeInfo?.menuDisplayMode ?? 'standard';
    const t = useTranslations('ar');
    const searchParams = useSearchParams();

    // URLパラメータからの初期モデル解決
    const modelIdParam = searchParams.get('model');
    const initialProduct = modelIdParam
        ? storeMenu.productModels.find(p => p.id === Number(modelIdParam))
        : undefined;

    // useMemoでオブジェクト参照を安定化（毎レンダーで新規オブジェクトになると無限ループになる）
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

    const defaultModelId = storeMenu.productModels.find(
        p => p.name === baseLocalizedStoreInfo?.firstEnvironment?.defaultModel?.name
    )?.id;
    const [currentModelId, setCurrentModelId] = useState<number | undefined>(
        initialProduct?.id ?? defaultModelId
    );

    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });
const [isPlaneDetected, setIsPlaneDetected] = useState(false);
    const [isInitialModelLoaded, setIsInitialModelLoaded] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState<number | undefined>(undefined);
    const handleLoadingChange = useCallback((loading: boolean) => {
        if (loading) setLoadingProgress(0);
        setIsModelLoading(loading);
    }, []);
    const [guideText, setGuideText] = useState(t('cameraLoading'));

    const handleCameraReady = useCallback(() => {
        setGuideText(t('scanning'));
        const scanningOverlay = document.getElementById('scanning-overlay');
        if (scanningOverlay) {
            scanningOverlay.style.display = 'flex';
        }
    }, [t]);

    const handlePlaneDetected = useCallback(() => {
        setIsPlaneDetected(true);
        setGuideText(t('modelLoading'));
        const scanningOverlay = document.getElementById('scanning-overlay');
        if (scanningOverlay) {
            scanningOverlay.style.display = 'none';
        }
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        if (arUI) arUI.style.display = 'block';
        if (exitButton) exitButton.style.display = 'block';
        const menuContainer = document.getElementById('menu-container') || document.getElementById('compact-menu-container');
        if (menuContainer) { menuContainer.style.display = 'flex' };
    }, [t]);

    const handleInitialModelLoaded = useCallback(() => {
        setIsInitialModelLoaded(true);
    }, []);

    useEffect(() => {
        if (isInitialModelLoaded && isPlaneDetected) {
            const guideId = menuDisplayMode === 'compact' ? 'compact-menu-openGuide' : 'menu-openGuide';
            const openPanel = document.getElementById(guideId);
            if (openPanel) {
                openPanel.style.display = 'flex';
            }
            const clearObjects = document.getElementById('clear-objects');
            const resetHit = document.getElementById('reset-hit');
            if (clearObjects) clearObjects.style.display = 'flex';
            if (resetHit) resetHit.style.display = 'flex';
        }
    }, [isInitialModelLoaded, isPlaneDetected, menuDisplayMode]);

    const showLoading = (isPlaneDetected && !isInitialModelLoaded) || isModelLoading;

    // モデル変更時にcurrentModelIdを追跡するラッパー
    const trackedChangeModel: ChangeModelFn = useCallback(async (info) => {
        if (info.modelName) {
            const found = storeMenu.productModels.find(p => p.name === info.modelName);
            if (found) setCurrentModelId(found.id);
        }
        await changeModel(info);
    }, [changeModel, storeMenu.productModels]);

    return (
        <>
            <LoadingPanel isVisible={showLoading} text={guideText} progress={loadingProgress} />
            <GuideScanPlane />
            <ModelChangeContext.Provider value={{ changeModel: trackedChangeModel }}>
                <ThreeMain
                    setChangeModel={setChangeModel}
                    onCameraReady={handleCameraReady}
                    onPlaneDetected={handlePlaneDetected}
                    onInitialModelLoaded={handleInitialModelLoaded}
                    onLoadingChange={handleLoadingChange}
                    onLoadingProgress={setLoadingProgress}
                    storeInfo={localizedStoreInfo}
                />
                {menuDisplayMode === 'compact' ? (
                    <CompactMenuContainer
                        productCategory={storeMenu.productCategory}
                        jaCategories={storeMenu.jaProductCategory}
                        productModels={storeMenu.productModels}
                    />
                ) : (
                    <MenuContainer
                        productCategory={storeMenu.productCategory}
                        jaCategories={storeMenu.jaProductCategory}
                        productModels={storeMenu.productModels}
                    />
                )}
            </ModelChangeContext.Provider>
        </>
    );
}
