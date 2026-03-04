/**
 * 8thWallAR モデル読み込み・解放
 */
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import type { ModelDisplaySettings } from '@/data/types';

export type ModelProps = {
    modelPath?: string;
    modelName?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};

// シーン内部状態（ThreeInit.ts のクロージャから渡される mutable object）
export type SceneState = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    reticle: THREE.Mesh;
    labelRenderer: CSS2DRenderer;
    loader: GLTFLoader;
    transControls: TransformControls;
    gizmo: THREE.Object3D;
    objectList: THREE.Object3D[];
    nowModel: THREE.Group | null;
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
};

export async function loadModel(
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

    const scale = displaySettings?.scale8thWallAR ?? displaySettings?.scale ?? 1;
    const detailPosition = displaySettings?.detailPosition ?? [0.1, 0.08, -0.03];
    const detailCenter = displaySettings?.detailCenter ?? [0, 0.8];

    try {
        // 既存モデルを削除
        if (state.nowModel) {
            state.transControls.detach();
            state.gizmo.visible = false;
            state.scene.remove(state.nowModel);
            disposeModel(state.nowModel);
            state.objectList.length = 0;
            state.nowModel = null;
        }

        state.onLoadingChange?.(true);

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

        state.transControls.attach(model);
        state.gizmo.visible = false;

        setTimeout(() => {
            state.onLoadingChange?.(false);
            state.camera.layers.enable(1);
        }, 100);

        return true;
    } catch (error) {
        state.onLoadingChange?.(false);
        console.error(error);
        return false;
    }
}

export function disposeModel(targetModel: THREE.Group): void {
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
