import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { useDeviceOrientation } from "@/lib/useDeviceOrientation";
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
    onLoadingProgress?: (progress: number) => void;
    storeInfo: StoreInfo | null;
};

export default function ThreeMain({ setChangeModel, onLoadingChange, onLoadingProgress, storeInfo }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);
    const autoRotateRef = useRef(true);

    // IMU（端末傾き）フック
    const { orientationRef, isSupported } = useDeviceOrientation();
    const isSupportedRef = useRef(false);
    const imuRotationRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        isSupportedRef.current = isSupported;
    }, [isSupported]);

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
        const nowModel = await loadModel(modelWithSettings, ctx, nowModelRef.current, onLoadingProgress);
        nowModelRef.current = nowModel;
        imuRotationRef.current = { x: 0, y: 0 }; // モデル切替時に IMU 回転をリセット
        onLoadingChange(false);
    }, [ctx, onLoadingChange, onLoadingProgress, storeDisplaySettings]);

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
        let stopAutoRotateHandler: (() => void) | null = null;

        (async () => {
            const rendererOptions = {
                pixelRatioCap: 2,
                alpha: true,
                antialias: true,
                useControls: true,
                hdrPath: firstEnvironment?.hdrPath,
                hdrFile: firstEnvironment?.hdrFile,
                cameraPosition: firstEnvironment?.cameraPosition,
                controlsTarget: firstEnvironment?.controlsTarget,
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
            canvasElement.addEventListener('click', clickHandlerRef);

            // 初期モデルの設定（firstEnvironmentがあればそれを使用）
            const firstModel = firstEnvironment?.defaultModel ? {
                modelName: firstEnvironment.defaultModel.name,
                modelPath: firstEnvironment.defaultModel.path,
                modelDetail: firstEnvironment.defaultModel.detail,
                modelPrice: firstEnvironment.defaultModel.price,
                displaySettings: firstEnvironment.modelDisplaySettings,
            } : {};
            onLoadingChange(true);
            const nowModel = await loadModel(firstModel, ctx, nowModelRef.current, onLoadingProgress);
            nowModelRef.current = nowModel;
            onLoadingChange(false);

            detachResize = attachResizeHandlers(ctx, container);

            // ── オート回転設定 ──────────────────────────────────
            let animationStartTime: number | null = null;
            // Spherical=球面座標, radius=半径(中心からどれくらい離れているか), phi=ファイ(上下方向の角度), theta=シータ(左右方向の角度)
            let initialSpherical: { radius: number; phi: number; theta: number } | null = null;
            const AUTO_ROTATE_MAX_ANGLE = Math.PI / 6;  // 回転する角度
            const AUTO_ROTATE_PERIOD = 10000;  // 1往復の時間

            stopAutoRotateHandler = () => { autoRotateRef.current = false; };
            ctx.controls?.addEventListener('start', stopAutoRotateHandler);

            function animation(time: number) {
                // オート回転（ユーザー操作が入るまで左右±30°を往復）
                if (autoRotateRef.current && ctx.controls) {
                    if (animationStartTime === null) {
                        animationStartTime = time;
                        const offset = ctx.camera.position.clone().sub(ctx.controls.target); // これでcontrols.targetを座標の中心にしている
                        const sph = new THREE.Spherical().setFromVector3(offset); // これを要素に分解x,y,zより考えやすいSphericalに分解
                        initialSpherical = { radius: sph.radius, phi: sph.phi, theta: sph.theta };
                    }
                    const elapsed = time - animationStartTime;
                    const angle = Math.sin((elapsed / AUTO_ROTATE_PERIOD) * Math.PI * 2) * AUTO_ROTATE_MAX_ANGLE;
                    if (initialSpherical) {
                        const sph = new THREE.Spherical(initialSpherical.radius, initialSpherical.phi, initialSpherical.theta + angle);
                        ctx.camera.position.copy(new THREE.Vector3().setFromSpherical(sph).add(ctx.controls.target)); // addはベクトルとして足してる
                    }
                }

                // IMU: 端末傾きをモデル回転に反映（カメラ視点から見た上下左右に対応）
                if (nowModelRef.current && isSupportedRef.current) {
                    const MAX_ANGLE = Math.PI / 8;  // 最大 22.5 度
                    const LERP = 0.05;  // 滑らかさ（0=静止、1=即時追従）
                    const { deltaBeta, deltaGamma } = orientationRef.current;
                    const targetX = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (deltaBeta  / 45) * MAX_ANGLE));
                    const targetY = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (deltaGamma / 45) * MAX_ANGLE));
                    imuRotationRef.current.x += (targetX - imuRotationRef.current.x) * LERP;
                    imuRotationRef.current.y += (targetY - imuRotationRef.current.y) * LERP;

                    // カメラの右方向・上方向ベクトルをワールド空間で取得
                    const camRight = new THREE.Vector3();
                    const camUp = new THREE.Vector3();
                    ctx.camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

                    // カメラ軸周りのクォータニオンで回転（ワールド軸ではなくカメラ視点基準）
                    const qX = new THREE.Quaternion().setFromAxisAngle(camRight, imuRotationRef.current.x);
                    const qY = new THREE.Quaternion().setFromAxisAngle(camUp, imuRotationRef.current.y);
                    nowModelRef.current.quaternion.copy(qX.multiply(qY));
                }

                ctx.controls?.update();
                ctx.renderer.render(ctx.scene, ctx.camera);
            }
            ctx.renderer.setAnimationLoop(animation);
        })();

        return () => {
            cancelled = true;
            if (threeContext) {
                if (stopAutoRotateHandler) {
                    threeContext.controls?.removeEventListener('start', stopAutoRotateHandler);
                }
                if (clickHandlerRef) {
                    canvasElement.removeEventListener('click', clickHandlerRef);
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
