/**
 * 8thWallAR 用 XR8 パイプラインモジュール
 * シーン初期化のみを担当。モデル操作は ThreeLoad.ts / ThreeClick.ts に分離。
 */
import type { XR8PipelineModule, XR8HitResult } from '@/types/xr8Types';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { StoreInfo } from '@/data/types';
import { loadModel, disposeModel, type ModelProps, type SceneState } from './ThreeLoad';
import { handleClick } from './ThreeClick';

export type { ModelProps };

export type PipelineModuleParams = {
    storeInfo: StoreInfo | null;
    onCameraReady: () => void;
    onPlaneDetected: () => void;
    onInitialModelLoaded: () => void;
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
};

// ---- XR8 パイプラインモジュール生成 ----
export function initScenePipelineModule(params: PipelineModuleParams): XR8PipelineModule {
    const { storeInfo, onCameraReady, onPlaneDetected, onInitialModelLoaded, onLoadingChange, onLoadingProgress } = params;

    const defaultModel = storeInfo?.firstEnvironment?.defaultModel;
    const displaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    let state: SceneState | null = null;
    let reticleShowTime: number | null = null;
    let viewNum = 0;
    let planeDetectedFired = false;
    let clickHandler: ((e: MouseEvent) => void) | null = null;

    return {
        name: 'foodARScene',

        onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
            const { scene, camera, renderer } = XR8.Threejs.xrScene();

            // CSS2DRenderer（視覚的オーバーレイのみ。操作は renderer.domElement で受け取る）
            const labelRenderer = new CSS2DRenderer();
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = '0px';
            labelRenderer.domElement.style.pointerEvents = 'none';
            labelRenderer.domElement.id = 'label';
            document.body.appendChild(labelRenderer.domElement);

            // KTX2 + GLTFLoader
            const ktx2 = new KTX2Loader();
            ktx2.setTranscoderPath('/basis/');
            ktx2.detectSupport(renderer);
            const loader = new GLTFLoader();
            loader.setKTX2Loader(ktx2);
            loader.setMeshoptDecoder(MeshoptDecoder);

            // レティクル
            const reticle = new THREE.Mesh(
                new THREE.RingGeometry(0.4, 0.3, 32).rotateX(-Math.PI / 2),
                new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 1.0 }),
            );
            reticle.visible = false;
            scene.add(reticle);

            // ライト
            scene.add(new THREE.AmbientLight(0xffffff, 1));
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // TransformControls（renderer.domElement に接続: XR8 キャンバスがタッチを受け取る）
            const transControls = new TransformControls(camera, renderer.domElement);
            transControls.showY = false;
            transControls.setMode('translate');
            const gizmo = transControls.getHelper();
            gizmo.visible = false;
            scene.add(gizmo);

            state = {
                scene,
                camera,
                renderer,
                reticle,
                labelRenderer,
                loader,
                transControls,
                gizmo,
                objectList: [],
                nowModel: null,
                onLoadingChange,
                onLoadingProgress,
            };

            // クリックハンドラを renderer.domElement に登録（XR8 キャンバスでタップを検出）
            clickHandler = handleClick(state);
            renderer.domElement.addEventListener('click', clickHandler);

            // カメラ準備完了を通知
            onCameraReady();

            // カメラ投影行列の同期
            XR8.XrController.updateCameraProjectionMatrix({
                origin: camera.position,
                facing: camera.quaternion,
            });

            // タッチスクロール防止
            canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        },

        onUpdate: () => {
            if (!state) return;

            const now = performance.now();
            let hits: XR8HitResult[];
            try {
                hits = XR8.XrController.hitTest(0.5, 0.5);
            } catch {
                return;
            }

            if (hits && hits.length > 0) {
                const hit = hits[0];
                state.reticle.position.set(hit.position.x, hit.position.y, hit.position.z);
                state.reticle.quaternion.set(hit.rotation.x, hit.rotation.y, hit.rotation.z, hit.rotation.w);
                state.reticle.visible = true;

                if (!planeDetectedFired) {
                    planeDetectedFired = true;
                    onPlaneDetected();
                }
            } else {
                state.reticle.visible = false;
            }

            // 1.5 秒後にデフォルトモデルを自動配置
            if (state.reticle.visible && reticleShowTime === null) {
                reticleShowTime = now;
            }
            if (!state.reticle.visible) {
                reticleShowTime = null;
            }
            if (viewNum === 0 && reticleShowTime !== null && now - reticleShowTime > 1500) {
                viewNum = 1;
                reticleShowTime = null;
                if (defaultModel && state) {
                    loadModel(
                        {
                            modelPath: defaultModel.path,
                            modelName: defaultModel.name,
                            modelDetail: defaultModel.detail,
                            modelPrice: defaultModel.price,
                            displaySettings,
                        },
                        state,
                    ).then((ok) => {
                        if (ok) onInitialModelLoaded();
                    });
                }
            }

            // レティクルとモデルの重なり判定
            if (state.reticle.visible && state.nowModel) {
                const box = new THREE.Box3().setFromObject(state.nowModel);
                const opacity = box.containsPoint(state.reticle.position) ? 0.1 : 1.0;
                (state.reticle.material as THREE.MeshBasicMaterial).opacity = opacity;
            }
        },

        onRender: () => {
            if (state?.labelRenderer && state.scene && state.camera) {
                state.labelRenderer.render(state.scene, state.camera);
            }
        },

        onResize: ({ canvasWidth, canvasHeight }: { canvasWidth: number; canvasHeight: number }) => {
            if (state?.labelRenderer) {
                state.labelRenderer.setSize(canvasWidth, canvasHeight);
            }
        },

        // モデル切り替え用 API（ThreeMain.tsx から呼ばれる）
        changeModel: async (modelProps: ModelProps): Promise<void> => {
            if (!state) return;
            await loadModel(modelProps, state);
        },

        // モデルクリア（ThreeMain.tsx の handleClear から呼ばれる）
        clearModel: (): void => {
            if (!state || !state.nowModel) return;
            state.transControls.detach();
            state.gizmo.visible = false;
            state.scene.remove(state.nowModel);
            disposeModel(state.nowModel);
            state.nowModel = null;
            state.objectList.length = 0;
        },

        // クリーンアップ
        cleanup: () => {
            if (!state) return;
            if (clickHandler) {
                state.renderer.domElement.removeEventListener('click', clickHandler);
            }
            state.transControls.dispose();
            if (state.labelRenderer.domElement.parentNode) {
                state.labelRenderer.domElement.parentNode.removeChild(state.labelRenderer.domElement);
            }
            if (state.nowModel) {
                disposeModel(state.nowModel);
            }
        },
    };
}

// XR8PipelineModule を再エクスポート（ThreeMain.tsx で使用）
export type { XR8PipelineModule };
