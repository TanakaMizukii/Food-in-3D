'use client'

import '../App.css';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuContainer from '@/components/Menu/MenuContainer';
import CompactMenuContainer from '@/components/Menu/CompactMenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import LoadingPanel from '@/components/Common/LoadingPanel';
import GuideQRCode from '@/components/ARjs/GuideQRCode';
import ThreeMain from '@/features/ARjs/ThreeMain';
import { findStoreBySlug } from '@/data/storeInfo';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';
import { getLocalizedStoreMenu, getLocalizedStoreInfo } from '@/data/storeMenus';
import { useTranslations } from 'next-intl';

import styled from "styled-components"

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// ページ遷移で来た場合のみリロードする（AR.jsのレイアウト問題を回避）
const ARJS_RELOAD_KEY = 'arjs-reloaded';

export default function ARjsPage() {
    // i18nによるAR.jsのカメラ映像の位置ずれへの対処用コード
    // 本質的な根本原因は未解決
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const alreadyReloaded = sessionStorage.getItem(ARJS_RELOAD_KEY);
        if (!alreadyReloaded) {
            sessionStorage.setItem(ARJS_RELOAD_KEY, 'true');
            window.location.reload();
            return;
        }
        // 再読み込み完了時コンテンツ表示
        setIsReady(true);
        // ページ離脱時にクリア
        return () => {
            sessionStorage.removeItem(ARJS_RELOAD_KEY);
        };
    }, []);

    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const storeInfo = findStoreBySlug(nowStore);
    const storeMenu = getLocalizedStoreMenu(nowStore, locale);
    const baseLocalizedStoreInfo = getLocalizedStoreInfo(storeInfo, storeMenu, locale);
    const menuDisplayMode = storeInfo?.menuDisplayMode ?? 'standard';
    const t = useTranslations('arjs');
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
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [isInitialModelLoaded, setIsInitialModelLoaded] = useState(false);
    const [isMarkerFound, setIsMarkerFound] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState<number | undefined>(undefined);
    const handleLoadingChange = useCallback((loading: boolean) => {
        if (loading) setLoadingProgress(0);
        setIsModelLoading(loading);
    }, []);
    const [guideText, setGuideText] = useState(t('cameraLoading'));

    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
        setIsGuideVisible(true);
    }, []);

    const handleInitialModelLoaded = useCallback(() => {
        setIsInitialModelLoaded(true);
    }, []);

    const handleGuideDismiss = useCallback(() => {
        setIsGuideVisible(false);
        setIsMarkerFound(true);
        setGuideText(t('modelLoading'));
        // arUIとexitButtonはマーカー検知時に表示
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        if (arUI && exitButton) {
            arUI.style.display = 'block';
            exitButton.style.display = 'block';
        }
    }, [t]);

    // 初期モデルロード完了 かつ マーカー検知完了 のときにopenPanelを表示
    useEffect(() => {
        if (isInitialModelLoaded && isMarkerFound) {
            // メニュー表示モードに応じたガイドIDを選択
            const guideId = menuDisplayMode === 'compact' ? 'compact-menu-openGuide' : 'menu-openGuide';
            const openPanel = document.getElementById(guideId);
            if (openPanel) {
                openPanel.style.display = 'flex';
            }
        }
    }, [isInitialModelLoaded, isMarkerFound, menuDisplayMode]);

    // ローディングパネルの表示条件:
    // 1. カメラ準備中 (!isCameraReady)
    // 2. マーカー検知後、まだ初期モデルがロードされていない (isMarkerFound && !isInitialModelLoaded)
    // 3. モデル切替中 (isModelLoading)
    const showLoading = !isCameraReady || (isMarkerFound && !isInitialModelLoaded) || isModelLoading;

    // リロード待機中は何も表示しない
    if (!isReady) {
        return <LoadingPanel isVisible={true} text={guideText} progress={loadingProgress} />;
    }

    // モデル変更時にcurrentModelIdを追跡するラッパー
    const trackedChangeModel: ChangeModelFn = useCallback(async (info) => {
        if (info.modelName) {
            const found = storeMenu.productModels.find(p => p.name === info.modelName);
            if (found) setCurrentModelId(found.id);
        }
        await changeModel(info);
    }, [changeModel, storeMenu.productModels]);

    return (
        <MyarJS>
            <LoadingPanel isVisible={showLoading} text={guideText} progress={loadingProgress} />
            <GuideQRCode isVisible={isGuideVisible} />
            <ModelChangeContext.Provider value={{ changeModel: trackedChangeModel }}>
                <ThreeMain
                    setChangeModel={setChangeModel}
                    onCameraReady={handleCameraReady}
                    onGuideDismiss={handleGuideDismiss}
                    onInitialModelLoaded={handleInitialModelLoaded}
                    onLoadingChange={handleLoadingChange}
                    onLoadingProgress={setLoadingProgress}
                    storeInfo={localizedStoreInfo}
                />
                {menuDisplayMode === 'compact' ? (
                    <CompactMenuContainer productCategory={storeMenu.productCategory} jaCategories={storeMenu.jaProductCategory} productModels={storeMenu.productModels} />
                ) : (
                    <MenuContainer productCategory={storeMenu.productCategory} jaCategories={storeMenu.jaProductCategory} productModels={storeMenu.productModels} />
                )}
            </ModelChangeContext.Provider>
        </MyarJS>
    );
}

const MyarJS = styled.div`
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#wrapper{
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh; /* 100vhより安定な端末が多い */
}
`