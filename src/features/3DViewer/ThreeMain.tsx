import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers, ThreeCtx } from "./ThreeInit";
import { loadModel } from "./ThreeLoad";
import { handleClick } from "./ThreeClick";
import type { StoreInfo, ModelDisplaySettings } from "@/data/types";

type ThreeContext = ThreeCtx;

// 先に型を用意
type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    onLoadingChange: (loading: boolean) => void;
    storeInfo: StoreInfo | null;
};

export default function ThreeMain({ setChangeModel, onLoadingChange, storeInfo }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);

    // 店舗のmodelDisplaySettingsを取得
    const storeDisplaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    const changeModel = useCallback(async (modelInfo: { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; }) => {
        if (!ctx) return;
        onLoadingChange(true);
        // displaySettingsが渡されていない場合は店舗のmodelDisplaySettingsを使用
        const modelWithSettings = {
            ...modelInfo,
            displaySettings: modelInfo.displaySettings ?? storeDisplaySettings,
        };
        // 新しいモデルをロード
        const nowModel = await loadModel(modelWithSettings, ctx, nowModelRef.current);
        nowModelRef.current = nowModel;
        onLoadingChange(false);
    }, [ctx, onLoadingChange, storeDisplaySettings]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        // アンマウント時に念のため no-op を戻すなら（任意）
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);


    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const container = containerRef.current;
        const firstEnvironment = storeInfo?.firstEnvironment;

        let cancelled = false;
        let threeContext: ThreeContext | null = null;
        let detachResize: (() => void) | null = null;
        let clickHandlerRef: ((e: MouseEvent) => void) | null = null;

        (async () => {
            const rendererOptions = {
                pixelRatioCap: 2,
                alpha: true,
                antialias: true,
                useControls: true,
                hdrPath: firstEnvironment?.hdrPath,
                hdrFile: firstEnvironment?.hdrFile,
                cameraPosition: firstEnvironment?.cameraPosition,
                lightIntensity: firstEnvironment?.lightIntensity,
                lightSettings: firstEnvironment?.lightSettings,
            };
            const ctx = await initThree(canvasElement, rendererOptions);

            // 非同期初期化中にアンマウントされた場合の処理
            if (cancelled) { ctx.dispose(); return; }

            threeContext = ctx;
            setCtx(ctx);

            const openPanel = document.getElementById('menu-openGuide');
            if (openPanel) { openPanel.style.display = 'flex'; }

            clickHandlerRef = handleClick(ctx);
            ctx.labelRenderer.domElement.addEventListener('click', clickHandlerRef);

            // 初期モデルの設定（firstEnvironmentがあればそれを使用）
            const firstModel = firstEnvironment?.defaultModel ? {
                modelName: firstEnvironment.defaultModel.name,
                modelPath: firstEnvironment.defaultModel.path,
                modelDetail: firstEnvironment.defaultModel.detail,
                modelPrice: firstEnvironment.defaultModel.price,
                displaySettings: firstEnvironment.modelDisplaySettings,
            } : {};
            onLoadingChange(true);
            const nowModel = await loadModel(firstModel, ctx, nowModelRef.current);
            nowModelRef.current = nowModel;
            onLoadingChange(false);

            detachResize = attachResizeHandlers(ctx, container);

            function animation() {
                console.log(ctx.camera.position);
                ctx.controls?.update();
                ctx.renderer.render(ctx.scene, ctx.camera);
                ctx.labelRenderer.render(ctx.scene, ctx.camera);
            }
            ctx.renderer.setAnimationLoop(animation);
        })();

        return () => {
            cancelled = true;
            if (threeContext) {
                if (clickHandlerRef) {
                    threeContext.labelRenderer.domElement.removeEventListener('click', clickHandlerRef);
                }
                detachResize?.();
                threeContext.dispose();
            }
        };
    }, [onLoadingChange, storeInfo]);

    return (
        <>
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
