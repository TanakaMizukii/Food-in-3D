/**
 * AlvaAR メインReactコンポーネント
 * ARjsのThreeMain.tsx + 既存index.jsのSLAMループロジックをベースに統合
 */
import * as THREE from 'three';
import styled from "styled-components"
import { useEffect, useRef, useState, useCallback } from 'react';
import { initThree, attachResizeHandlers } from '@/features/AlvaAR/ThreeInit';
import { loadModel, disposeModel } from '@/features/AlvaAR/ThreeLoad';
import { handleClick } from '@/features/AlvaAR/ThreeClick';
import { loadAlvaAR, type AlvaARInstance } from '@/features/AlvaAR/AlvaARLoader';
import { createPoseApplier, applyPlaneMatrix } from '@/features/AlvaAR/AlvaARConnector';
import { initCamera, onFrame, resize2cover, stopCamera, type CoverRect } from '@/features/AlvaAR/CameraStream';
import ARHelper from '@/components/AR/ARHelper';
import { useRouter } from 'next/navigation';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';

import type { StoreInfo, ModelDisplaySettings } from '@/data/types';

type ThreeContext = ReturnType<typeof initThree>;

type ModelInfo = {
    modelName?: string;
    modelPath?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    onCameraReady: () => void;
    onPlaneDetected: () => void;
    onInitialModelLoaded: () => void;
    storeInfo: StoreInfo | null;
};

export default function ThreeMain({
    setChangeModel,
    onCameraReady,
    onPlaneDetected,
    onInitialModelLoaded,
    storeInfo,
}: ThreeMainProps) {
    const router = useRouter();
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);
    const alvaRef = useRef<AlvaARInstance | null>(null);
    const loopActiveRef = useRef(true);

    const storeDisplaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    const changeModel = useCallback(async (modelInfo: ModelInfo) => {
        if (!ctx) return;
        const modelWithSettings = {
            ...modelInfo,
            displaySettings: modelInfo.displaySettings ?? storeDisplaySettings,
        };
        await loadModel(modelWithSettings, ctx, ctx.reticle);
    }, [ctx, storeDisplaySettings]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        loopActiveRef.current = true;

        let detachResize: (() => void) | null = null;
        let threeContext: ThreeContext | null = null;
        let videoElement: HTMLVideoElement | null = null;

        (async () => {
            // 1. カメラ映像取得
            const cameraConfig: MediaStreamConstraints = {
                video: {
                    facingMode: 'environment',
                    aspectRatio: 16 / 9,
                    width: { ideal: 1280 },
                },
                audio: false,
            };
            const media = await initCamera(cameraConfig);
            videoElement = media.el;

            if (!loopActiveRef.current) {
                stopCamera(videoElement);
                return;
            }

            const canvasWidth = container.clientWidth;
            const canvasHeight = container.clientHeight;
            const size: CoverRect = resize2cover(
                media.width, media.height,
                canvasWidth, canvasHeight,
            );

            // 2. Three.js初期化
            const firstEnv = storeInfo?.firstEnvironment;
            threeContext = initThree(container, canvasWidth, canvasHeight, {
                pixelRatioCap: 2,
                alpha: true,
                antialias: true,
                hdrPath: firstEnv?.hdrPath,
                hdrFile: firstEnv?.hdrFile,
                lightIntensity: firstEnv?.lightIntensity,
            });
            setCtx(threeContext);

            // カメラ映像用canvasをThree.jsレンダラーの前に挿入
            container.insertBefore(threeContext.videoCanvas, threeContext.renderer.domElement);

            // クリックハンドラ
            const clickHandler = handleClick(threeContext);
            threeContext.labelRenderer.domElement.style.pointerEvents = 'auto';
            threeContext.labelRenderer.domElement.addEventListener('click', clickHandler);

            // リサイズ
            detachResize = attachResizeHandlers(threeContext, container);

            onCameraReady();

            // 3. AlvaAR WASM初期化
            const alva = await loadAlvaAR(canvasWidth, canvasHeight);
            alvaRef.current = alva;

            if (!loopActiveRef.current) return;

            // 4. ポーズ変換関数
            const applyPose = createPoseApplier();

            // 5. 店舗設定
            const defaultModel = firstEnv?.defaultModel;
            const scaleAlvaAR = firstEnv?.modelDisplaySettings?.scaleAlvaAR ?? 100;

            // SLAM状態変数
            let reticleShowTime: number | null = null;
            let viewNum = 0;
            let lastPlaneTime = 0;
            let planeDetectedOnce = false;

            const { scene, camera, renderer, labelRenderer, reticle, videoCanvas, videoCtx } = threeContext;

            // 6. SLAMフレームループ
            onFrame((now) => {
                if (!loopActiveRef.current) return false;

                videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);

                if (!document.hidden) {
                    // カメラ映像をcanvasに描画
                    videoCtx.drawImage(
                        videoElement!,
                        0, 0, media.width, media.height,
                        size.x, size.y, size.width, size.height,
                    );
                    const frame = videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height);

                    // SLAMポーズ推定
                    const pose = alva.findCameraPose(frame);

                    if (pose) {
                        applyPose(pose, camera.quaternion, camera.position);

                        // 平面検出（0.3秒間隔）
                        if (now - lastPlaneTime > 300) {
                            lastPlaneTime = now;
                            const planeMatrix = alva.findPlane();
                            if (planeMatrix) {
                                applyPlaneMatrix(planeMatrix, reticle as THREE.Mesh);
                                reticle.visible = true;

                                if (!planeDetectedOnce) {
                                    planeDetectedOnce = true;
                                    onPlaneDetected();
                                }
                            }
                        }

                        // 特徴点の描画
                        const dots = alva.getFramePoints();
                        for (const p of dots) {
                            videoCtx.fillStyle = 'white';
                            videoCtx.fillRect(p.x, p.y, 2, 2);
                        }
                    } else {
                        reticle.visible = false;
                        // ポーズ失敗時も特徴点は描画
                        const dots = alva.getFramePoints();
                        for (const p of dots) {
                            videoCtx.fillStyle = 'white';
                            videoCtx.fillRect(p.x, p.y, 2, 2);
                        }
                    }

                    // レティクル表示後の自動モデル配置
                    if (reticle.visible && reticleShowTime === null) {
                        reticleShowTime = now;
                    }
                    if (!reticle.visible) {
                        reticleShowTime = null;
                    }
                    // レティクル表示1.5秒後にデフォルトモデルを配置
                    if (viewNum === 0 && reticleShowTime !== null && now - reticleShowTime > 1500) {
                        if (defaultModel && threeContext) {
                            loadModel({
                                modelName: defaultModel.name,
                                modelPath: defaultModel.path,
                                modelDetail: defaultModel.detail,
                                modelPrice: defaultModel.price,
                                displaySettings: firstEnv?.modelDisplaySettings,
                            }, threeContext, reticle as THREE.Mesh);
                            onInitialModelLoaded();
                        }
                        viewNum = 1;
                        reticleShowTime = null;
                    }

                    // レティクルとモデルの当たり判定（透明度変更）
                    if (reticle.visible && threeContext?.nowModel) {
                        const box = new THREE.Box3().setFromObject(threeContext.nowModel);
                        const colliding = box.containsPoint(reticle.position);
                        (reticle.material as THREE.MeshBasicMaterial).opacity = colliding ? 0.1 : 1.0;
                    }

                    renderer.render(scene, camera);
                    labelRenderer.render(scene, camera);
                }

                return true;
            }, 30);
        })();

        return () => {
            loopActiveRef.current = false;
            if (videoElement) stopCamera(videoElement);
            if (detachResize) detachResize();
            if (threeContext) {
                threeContext.labelRenderer.domElement.removeEventListener('click', handleClick(threeContext));
                threeContext.dispose();
            }
        };
    }, [storeInfo]);

    const handleExit = () => {
        router.push(`/${locale}/${nowStore}/viewer`);
    };

    const handleClear = () => {
        if (!ctx?.nowModel) return;
        ctx.scene.remove(ctx.nowModel);
        disposeModel(ctx.nowModel);
        ctx.nowModel = null;
        ctx.objectList.length = 0;
    };

    const handleReset = () => {
        alvaRef.current?.reset();
    };

    return (
        <>
            <ARHelper
                onExit={handleExit}
                onClear={handleClear}
                onReset={handleReset}
                showClearObjects={true}
                showResetHit={true}
            />
            <MyAlvaAR
                id="container"
                ref={containerRef}
            />
        </>
    );
}

const MyAlvaAR = styled.div`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    background: #000;

    & > * {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
    }

    canvas {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }

    & > video {
        object-fit: cover;
        object-position: 50% 50%;
    }
`;
