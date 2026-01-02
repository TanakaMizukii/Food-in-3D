import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers } from "@/features/ARjs/ThreeInit";
import { loadModel } from "@/features/ARjs/ThreeLoad";
import { handleClick } from "@/features/ARjs/ThreeClick";
import LoadingPanel from "@/components/Common/LoadingPanel";
import ARHelper from "@/components/AR/ARHelper";
import { useRouter } from "next/navigation";
import { catchParentPathName } from '@/lib/catchPathname';

import type { StoreInfo, ModelDisplaySettings } from "@/data/types";

/** AR.js Main */
type ThreeContext = ReturnType<typeof initThree>;

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    onCameraReady: () => void;
    onGuideDismiss: () => void;
    onInitialModelLoaded: () => void;
    storeInfo: StoreInfo | null;
};

export default function ThreeMain({ setChangeModel, onCameraReady, onGuideDismiss, onInitialModelLoaded, storeInfo }: ThreeMainProps) {
    const router = useRouter();
    const nowStore = catchParentPathName();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);

    // 店舗のmodelDisplaySettingsを取得
    const storeDisplaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    const changeModel = useCallback(async (modelInfo: { modelName?: string, modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; }) => {
        if (!ctx) return;
        // displaySettingsが渡されていない場合は店舗のmodelDisplaySettingsを使用
        const modelWithSettings = {
            ...modelInfo,
            displaySettings: modelInfo.displaySettings ?? storeDisplaySettings,
        };
        // 新しいモデルをロード
        const nowModel = await loadModel(modelWithSettings, ctx, nowModelRef.current);
        nowModelRef.current = nowModel;
    }, [ctx, storeDisplaySettings]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        // アンマウント時に念のため no-op を戻すなら（任意）
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const firstEnvironment = storeInfo?.firstEnvironment;
        const rendererOptions = {
            pixelRatioCap: 2,
            alpha: true,
            antialias: true,
            hdrPath: firstEnvironment?.hdrPath,
            hdrFile: firstEnvironment?.hdrFile,
            lightIntensity: firstEnvironment?.lightIntensity,
        };
        const threeContext = initThree(canvasElement, rendererOptions, onCameraReady, onGuideDismiss);
        setCtx(threeContext);
        const clickHandler = handleClick(threeContext);
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {menuContainer.style.display = 'block'};
        threeContext.labelRenderer.domElement.addEventListener('click', clickHandler);

        (async () => {
            if (!firstEnvironment) return;

            const firstModel = firstEnvironment.defaultModel;

            if(threeContext){
                const nowModel = await loadModel({
                    modelName: firstModel.name,
                    modelPath: firstModel.path,
                    modelDetail: firstModel.detail,
                    modelPrice: firstModel.price,
                    displaySettings: firstEnvironment.modelDisplaySettings,
                }, threeContext, null);
                nowModelRef.current = nowModel;
                onInitialModelLoaded();
            }
        })();

        const detach = attachResizeHandlers(threeContext, containerRef.current);

        function animate() {
            if (threeContext.arToolkitSource.ready) {
                threeContext.arToolkitContext.update(threeContext.arToolkitSource.domElement);
            }
            threeContext.smoothedControls.update(threeContext.markerRoot);
            threeContext.renderer.render(threeContext.scene, threeContext.camera);
            threeContext.labelRenderer.render(threeContext.scene, threeContext.camera);
            requestAnimationFrame(animate)
        }
        animate();

        return () => {
            threeContext.labelRenderer.domElement.removeEventListener('click', clickHandler);
            detach();
            threeContext.dispose();
        };
    }, [onCameraReady, onGuideDismiss, storeInfo]);

    const handleExit = () => {
        router.push(`/${nowStore}/viewer`);
    };

    return (
        <>
            <LoadingPanel />
            <ARHelper onExit={handleExit} showClearObjects={false} showResetHit={false}/>
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
