'use client'

import '../App.css';
import { useState, useCallback } from 'react';
import MenuContainer from '@/components/Menu/MenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import LoadingPanel from '@/components/Common/LoadingPanel';
import GuideQRCode from '@/components/ARjs/GuideQRCode';
import ThreeMain from '@/features/ARjs/ThreeMain';
import { findStoreBySlug } from '@/data/storeInfo';
import { catchParentPathName } from '@/lib/catchPathname';
import { getStoreMenu } from '@/data/storeMenus';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function ARjsPage() {
    const storeSlug = catchParentPathName();
    const storeInfo = findStoreBySlug(storeSlug);
    const storeMenu = getStoreMenu(storeSlug);

    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [isInitialModelLoaded, setIsInitialModelLoaded] = useState(false);
    const [isMarkerFound, setIsMarkerFound] = useState(false);
    const [guideText, setGuideText] = useState("カメラを準備しています...\n少々お待ちください。\n\n案内が出たら「許可」を押してください");

    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
        setIsGuideVisible(true);
    }, []);

    const handleInitialModelLoaded = useCallback(() => {
        setIsInitialModelLoaded(true);
        // モデルロード完了後にopenPanelを表示（ローディング画面と被らないように)
        const openPanel = document.getElementById('menu-openGuide');
        if (openPanel) {
            openPanel.style.display = 'flex';
        }
    }, []);

    const handleGuideDismiss = useCallback(() => {
        setIsGuideVisible(false);
        setIsMarkerFound(true);
        setGuideText("モデルを読み込み中です...\n少々お待ちください");
        // arUIとexitButtonはマーカー検知時に表示
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        if (arUI && exitButton) {
            arUI.style.display = 'block';
            exitButton.style.display = 'block';
        }
    }, []);

    // ローディングパネルの表示条件:
    // 1. カメラ準備中 (!isCameraReady)
    // 2. マーカー検知後、まだ初期モデルがロードされていない (isMarkerFound && !isInitialModelLoaded)
    const showLoading = !isCameraReady || (isMarkerFound && !isInitialModelLoaded);

    return (
        <>
            <LoadingPanel isVisible={showLoading} text={guideText} />
            <GuideQRCode isVisible={isGuideVisible} />
            <ModelChangeContext.Provider value={{ changeModel }}>
                <ThreeMain
                    setChangeModel={setChangeModel}
                    onCameraReady={handleCameraReady}
                    onGuideDismiss={handleGuideDismiss}
                    onInitialModelLoaded={handleInitialModelLoaded}
                    storeInfo={storeInfo}
                />
                <MenuContainer productCategory={storeMenu.productCategory} productModels={storeMenu.productModels} />
            </ModelChangeContext.Provider>
        </>
    );
}
