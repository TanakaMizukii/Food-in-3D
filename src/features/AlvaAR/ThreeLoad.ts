/**
 * AlvaAR用モデルロード
 * ARjsのThreeLoad.tsをベースに、配置方法をAlvaAR（レティクル位置配置）に変更
 */
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import type { ThreeCtx } from './ThreeInit';
import type { ModelDisplaySettings } from '@/data/types';

export type ModelProps = {
    modelName?: string;
    modelPath?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};

/**
 * モデルをロードしてレティクルの位置に配置する
 */
export async function loadModel(
    Model: ModelProps,
    ctx: ThreeCtx,
    reticle: THREE.Mesh,
    onProgress?: (progress: number) => void,
): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
    const {
        modelName = 'モデル',
        modelPath = '/models/denden/chicken_combo_large_comp.glb',
        modelDetail = '',
        modelPrice = '',
        displaySettings,
    } = Model;

    // AlvaAR用スケール（scaleAlvaAR > scale > 100 の優先順位）
    const scale = displaySettings?.scaleAlvaAR ?? displaySettings?.scale ?? 100;
    const detailPosition = displaySettings?.detailPosition ?? [0.1, 0.08, -0.03];
    const detailCenter = displaySettings?.detailCenter ?? [0, 0.8];

    // LoadingManager を生成し、ロード完了時に 100% を通知
    const manager = new THREE.LoadingManager(() => { onProgress?.(100); });
    ctx.loader.manager = manager;

    try {
        // 前モデルの削除
        if (ctx.nowModel) {
            ctx.scene.remove(ctx.nowModel);
            disposeModel(ctx.nowModel);
            ctx.objectList.length = 0;
        }

        // モデルロード（バイト単位の進捗コールバック付き）
        const gltf = await ctx.loader.loadAsync(modelPath, (event: ProgressEvent) => {
            if (event.lengthComputable && event.total > 0) {
                onProgress?.(Math.round((event.loaded / event.total) * 100));
            }
        });
        const model = gltf.scene;
        model.scale.set(scale, scale, scale);
        model.userData.isDetail = true;

        // レティクルの位置・姿勢をモデルにコピー
        model.position.copy(reticle.position);
        model.quaternion.copy(reticle.quaternion);
        model.rotateX(Math.PI / 2);
        model.rotateY(Math.PI / 2);

        ctx.scene.add(model);
        ctx.objectList.push(model);
        ctx.nowModel = model;

        // 全メッシュをraycasting用リストに追加
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                ctx.objectList.push(child);
            }
        });

        // 詳細ラベル作成
        const detailElement = document.querySelector('.detail');
        if (detailElement) {
            detailElement.remove();
        }
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
        detail.center.set(detailCenter[0], detailCenter[1]);
        model.add(detail);
        detail.layers.set(1);

        // 初回だけdetailレイヤー有効化
        if (ctx.detailNum === 0) {
            ctx.camera.layers.enable(1);
            ctx.detailNum += 1;
        }

        ctx.loader.manager = THREE.DefaultLoadingManager;
        return model;
    } catch (error) {
        ctx.loader.manager = THREE.DefaultLoadingManager;
        console.error(error);
        alert('モデルの読み込みに失敗しました。');
        return null;
    }
}

/** モデルのメモリ解放 */
export function disposeModel(targetModel: THREE.Object3D): void {
    const detailElement = document.querySelector('.detail');
    if (detailElement) {
        detailElement.remove();
    }
    targetModel.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                for (const material of obj.material) {
                    material.dispose();
                    if (material.map) material.map.dispose();
                }
            } else {
                obj.material.dispose();
                if (obj.material.map) obj.material.map.dispose();
            }
        }
    });
}
