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
import { createPoseApplier, deviceOrientationToQuaternion, computeUpWorld } from '@/features/AlvaAR/AlvaARConnector';
import type { IMUOrientation, IMUMotionSample } from '@/features/AlvaAR/AlvaARLoader';
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
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
    storeInfo: StoreInfo | null;
};

export default function ThreeMain({
    setChangeModel,
    onCameraReady,
    onPlaneDetected,
    onInitialModelLoaded,
    onLoadingChange,
    onLoadingProgress,
    storeInfo,
}: ThreeMainProps) {
    const router = useRouter();
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);
    const alvaRef = useRef<AlvaARInstance | null>(null);
    const loopActiveRef = useRef(true);
    const viewNumRef = useRef(0);
    const reticleShowTimeRef = useRef<number | null>(null);

    const onLoadingProgressRef = useRef(onLoadingProgress);
    useEffect(() => { onLoadingProgressRef.current = onLoadingProgress; }, [onLoadingProgress]);

    const storeDisplaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    const changeModel = useCallback(async (modelInfo: ModelInfo) => {
        if (!ctx) return;
        onLoadingChange?.(true);
        const modelWithSettings = {
            ...modelInfo,
            displaySettings: modelInfo.displaySettings ?? storeDisplaySettings,
        };
        await loadModel(modelWithSettings, ctx, ctx.reticle, onLoadingProgress);
        onLoadingChange?.(false);
    }, [ctx, onLoadingChange, onLoadingProgress, storeDisplaySettings]);

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
        let handleOrientation: ((e: DeviceOrientationEvent) => void) | null = null;
        let handleMotion:      ((e: DeviceMotionEvent)      => void) | null = null;

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
                lightSettings: firstEnv?.lightSettings,
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

            // SLAM状態変数（リセット対応のためrefを使用）
            viewNumRef.current = 0;
            reticleShowTimeRef.current = null;
            let planeDetectedOnce = false;

            // IMU状態変数
            let imuOrientation: IMUOrientation = { w: 1, x: 0, y: 0, z: 0 };
            const motionBuffer: IMUMotionSample[] = [];
            const MOTION_BUFFER_MAX = 20;

            // IMUリスナー: 方向クォータニオンを更新
            handleOrientation = (e: DeviceOrientationEvent) => {
                const a = e.alpha ?? 0;
                const b = e.beta  ?? 0;
                const g = e.gamma ?? 0;
                imuOrientation = deviceOrientationToQuaternion(a, b, g);
            };
            // IMUリスナー: ジャイロ + 加速度をバッファに蓄積
            handleMotion = (e: DeviceMotionEvent) => {
                const rr = e.rotationRate;
                const ac = e.acceleration;
                if (!rr || !ac) return;
                motionBuffer.push({
                    timestamp: performance.now(),
                    gx: rr.beta  ?? 0,
                    gy: rr.gamma ?? 0,
                    gz: rr.alpha ?? 0,
                    ax: ac.x ?? 0,
                    ay: ac.y ?? 0,
                    az: ac.z ?? 0,
                });
                if (motionBuffer.length > MOTION_BUFFER_MAX) motionBuffer.shift();
            };
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            window.addEventListener('devicemotion',      handleMotion,      { passive: true });

            const { scene, camera, renderer, labelRenderer, reticle, videoCanvas, videoCtx } = threeContext;

            // ARCamIMUView アプローチ: 仮想地面（findPlane の代替）
            // IMUから算出した重力方向を使い、カメラから GROUND_DIST 単位下に地面平面を設置して
            // 毎フレームのレイキャストでリティクル位置を決定する
            const GROUND_DIST = 10;
            const virtualGround = new THREE.Mesh(
                new THREE.CircleGeometry(1000, 32),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide }),
            );
            // 向き・位置はフレームループ内で IMU データにより動的に更新する
            scene.add(virtualGround);
            const groundRaycaster = new THREE.Raycaster();
            const centerNDC = new THREE.Vector2(0, 0); // 画面中央

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

                    // SLAMポーズ推定（IMUデータがあればIMU融合、なければ視覚SLAM）
                    const pose = motionBuffer.length > 0
                        ? alva.findCameraPoseWithIMU(frame, imuOrientation, [...motionBuffer])
                        : alva.findCameraPose(frame);

                    if (pose) {
                        applyPose(pose, camera.quaternion, camera.position);

                        // IMUから実世界の「上」方向を算出し、仮想地面を現実の水平面に合わせる
                        const upWorld = computeUpWorld(imuOrientation, camera.quaternion);

                        // 仮想地面: CircleGeometry のローカル法線 (+Z) を upWorld に向け、
                        // カメラの GROUND_DIST 単位下（重力方向）に中心を配置
                        virtualGround.quaternion.setFromUnitVectors(
                            new THREE.Vector3(0, 0, 1), upWorld,
                        );
                        virtualGround.position.copy(camera.position)
                            .addScaledVector(upWorld, -GROUND_DIST);

                        groundRaycaster.setFromCamera(centerNDC, camera);
                        const groundHits = groundRaycaster.intersectObject(virtualGround);
                        if (groundHits.length > 0) {
                            reticle.position.copy(groundHits[0].point);
                            // レティクルをIMU基準の地面平面に平行に向ける
                            reticle.quaternion.setFromUnitVectors(
                                new THREE.Vector3(0, 0, 1), upWorld,
                            );
                            reticle.visible = true;

                            if (!planeDetectedOnce) {
                                planeDetectedOnce = true;
                                onPlaneDetected();
                            }
                        }

                        // 特徴点の描画
                        const dots = alva.getFramePoints();
                        for (const p of dots) {
                            videoCtx.fillStyle = 'white';
                            videoCtx.fillRect(p.x, p.y, 2, 2);
                        }
                    } else {
                        // モデル未配置の場合のみリティクルを隠す
                        // モデル配置済みなら最後の位置を維持して表示継続
                        if (!threeContext!.nowModel) {
                            reticle.visible = false;
                        }
                        // ポーズ失敗時も特徴点は描画
                        const dots = alva.getFramePoints();
                        for (const p of dots) {
                            videoCtx.fillStyle = 'white';
                            videoCtx.fillRect(p.x, p.y, 2, 2);
                        }
                    }

                    // レティクル表示後の自動モデル配置
                    if (reticle.visible && reticleShowTimeRef.current === null) {
                        reticleShowTimeRef.current = now;
                    }
                    if (!reticle.visible) {
                        reticleShowTimeRef.current = null;
                    }
                    // レティクル表示1.5秒後にデフォルトモデルを配置
                    if (viewNumRef.current === 0 && reticleShowTimeRef.current !== null && now - reticleShowTimeRef.current > 1500) {
                        if (defaultModel && threeContext) {
                            loadModel({
                                modelName: defaultModel.name,
                                modelPath: defaultModel.path,
                                modelDetail: defaultModel.detail,
                                modelPrice: defaultModel.price,
                                displaySettings: firstEnv?.modelDisplaySettings,
                            }, threeContext, reticle as THREE.Mesh, onLoadingProgressRef.current).then(() => {
                                onInitialModelLoaded();
                            });
                        }
                        viewNumRef.current = 1;
                        reticleShowTimeRef.current = null;
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
            if (handleOrientation) window.removeEventListener('deviceorientation', handleOrientation);
            if (handleMotion)      window.removeEventListener('devicemotion',      handleMotion);
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
        // 状態変数をリセットして再トラッキング・再自動配置を有効化
        viewNumRef.current = 0;
        reticleShowTimeRef.current = null;
        // モデルをシーンから除去し、レティクルを非表示にする
        if (ctx?.nowModel) {
            ctx.scene.remove(ctx.nowModel);
            disposeModel(ctx.nowModel);
            ctx.nowModel = null;
            ctx.objectList.length = 0;
        }
        if (ctx?.reticle) ctx.reticle.visible = false;
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
