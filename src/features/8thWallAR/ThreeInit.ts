/**
 * 8thWallAR 用 Three.js + XR8 パイプラインモジュール
 * threejs-scene-init.js を TypeScript 化したもの。
 * storeInfo / scale は引数で受け取り、window.loadModel などのグローバル公開は廃止。
 */
import type { XR8PipelineModule, XR8HitResult } from './xr8Types';
import * as THREE from 'three';
window.THREE = THREE;
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { StoreInfo, ModelDisplaySettings } from '@/data/types';

export type ModelProps = {
    modelPath?: string;
    modelName?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};

export type PipelineModuleParams = {
    storeInfo: StoreInfo | null;
    onCameraReady: () => void;
    onPlaneDetected: () => void;
    onInitialModelLoaded: () => void;
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
};

// ---- モデル読み込み ----
async function loadModel(
    modelProps: ModelProps,
    state: SceneState,
): Promise<boolean> {
    const {
        modelPath = '/models/denden/chicken_combo_large_comp.glb',
        modelName = 'モデル',
        modelDetail = '',
        modelPrice = '',
        displaySettings,
    } = modelProps;

    const scale = displaySettings?.scale8thWallAR ?? displaySettings?.scale ?? 2;
    const detailPosition = displaySettings?.detailPosition ?? [0.1, 0.08, -0.03];
    const detailCenter = displaySettings?.detailCenter ?? [0, 0.8];

    try {
        // 既存モデルを削除
        if (state.nowModel) {
            state.scene.remove(state.nowModel);
            disposeModel(state.nowModel);
            state.objectList.length = 0;
            state.nowModel = null;
        }

        state.onLoadingChange?.(true);

        // GLB ロード
        const gltf = await state.loader.loadAsync(modelPath, (event: ProgressEvent) => {
            if (event.lengthComputable && event.total > 0) {
                state.onLoadingProgress?.(Math.round((event.loaded / event.total) * 100));
            }
        });
        const model = gltf.scene as THREE.Group;
        model.scale.set(scale, scale, scale);
        model.userData.isDetail = true;

        // レティクルの位置・向きにモデルを配置
        model.position.copy(state.reticle.position);
        model.quaternion.copy(state.reticle.quaternion);
        model.rotateX(Math.PI / 2);
        model.rotateY(Math.PI / 2);

        state.scene.add(model);
        state.nowModel = model;
        state.objectList.push(model);

        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                state.objectList.push(child);
            }
        });

        // 詳細パネル（CSS2DObject）作成
        const detailDiv = document.createElement('div');
        detailDiv.className = 'detail';
        detailDiv.innerHTML = `
            <h3 class="panel__name">${modelName}</h3><hr>
            <p class="panel__desc">${modelDetail}</p>
            <div class="panel__price" aria-label="価格">
                <span class="food-panel__price-currency">￥</span>
                <span class="panel__price-value">${modelPrice} 円</span>
            </div>
        `;

        const detail = new CSS2DObject(detailDiv);
        detail.position.set(detailPosition[0], detailPosition[1], detailPosition[2]);
        detail.center = new THREE.Vector2(detailCenter[0], detailCenter[1]);
        model.add(detail);
        detail.layers.set(1);

        setTimeout(() => {
            state.onLoadingChange?.(false);
            if (state.detailNum === 0) {
                state.camera.layers.enable(1);
                state.detailNum += 1;
            }
        }, 100);

        return true;
    } catch (error) {
        state.onLoadingChange?.(false);
        console.error(error);
        return false;
    }
}

// ---- モデルリソース解放 ----
function disposeModel(targetModel: THREE.Group): void {
    const detailElement = document.querySelector('.detail');
    if (detailElement) detailElement.remove();

    targetModel.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material;
        if (mat) {
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
            else (mat as THREE.Material).dispose?.();
        }
        if ((mesh.material as THREE.MeshStandardMaterial)?.map) {
            (mesh.material as THREE.MeshStandardMaterial).map?.dispose();
        }
    });
}

// ---- シーン内部状態 ----
type SceneState = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    reticle: THREE.Mesh;
    labelRenderer: CSS2DRenderer;
    loader: GLTFLoader;
    objectList: THREE.Object3D[];
    nowModel: THREE.Group | null;
    detailNum: number;
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
};

// ---- クリックハンドラ ----
function handleClick(event: MouseEvent, state: SceneState): void {
    const element = event.currentTarget as HTMLElement;
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, state.camera);
    const intersects = raycaster.intersectObjects(state.objectList, true);

    if (intersects.length > 0) {
        event.stopPropagation();
        let clicked = intersects[0].object;
        while (clicked.parent && clicked !== state.nowModel) {
            clicked = clicked.parent;
        }
        clicked.userData.isDetail = !clicked.userData.isDetail;
        const el = document.querySelector('.detail') as HTMLElement | null;
        if (el) el.style.visibility = clicked.userData.isDetail ? 'visible' : 'hidden';
    }
}

// ---- XR8 パイプラインモジュール生成 ----
export function initScenePipelineModule(params: PipelineModuleParams): XR8PipelineModule {
    const { storeInfo, onCameraReady, onPlaneDetected, onInitialModelLoaded, onLoadingChange, onLoadingProgress } = params;

    const defaultModel = storeInfo?.firstEnvironment?.defaultModel;
    const displaySettings = storeInfo?.firstEnvironment?.modelDisplaySettings;

    // 状態はクロージャでカプセル化（モジュールスコープを汚染しない）
    let state: SceneState | null = null;
    let reticleShowTime: number | null = null;
    let viewNum = 0;
    let planeDetectedFired = false;
    let clickHandler: ((e: MouseEvent) => void) | null = null;

    return {
        name: 'foodARScene',

        onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
            const { scene, camera, renderer } = XR8.Threejs.xrScene();

            // CSS2DRenderer
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

            state = {
                scene,
                camera,
                renderer,
                reticle,
                labelRenderer,
                loader,
                objectList: [],
                nowModel: null,
                detailNum: 0,
                onLoadingChange,
                onLoadingProgress,
            };

            // クリックハンドラ登録
            clickHandler = (e: MouseEvent) => {
                if (state) handleClick(e, state);
            };
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
