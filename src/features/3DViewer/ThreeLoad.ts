import * as THREE from 'three';
import type { ThreeCtx } from './ThreeInit';
import type { ModelDisplaySettings } from '@/data/types';

export type LoadCtx = {
    nowModel?: null|THREE.Group<THREE.Object3DEventMap>;
    detailNum?: number;
}

export type ModelProps = {
    modelName?: string;
    modelPath?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
}

export async function loadModel(Model: ModelProps, ctx: ThreeCtx, prevModel: THREE.Group<THREE.Object3DEventMap> | null): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
    const {
        modelPath = '/models/denden/お試し皿盆4_raw_comp.glb',
        displaySettings,
    } = Model;

    // デフォルト値を設定（scale3DViewer > scale > 1 の優先順位）
    const scale = displaySettings?.scale3DViewer ?? displaySettings?.scale ?? 1;


    try {
        if (prevModel) {
            ctx.scene.remove(prevModel);
            // 変更する前に今まで映していたモデルのメモリの解放
            disposeModel(prevModel);
            // オブジェクトのリストをクリア
            ctx.objectList = [];
        }

        // ローディングインジケーターの表示
        const loadingOverlay = document.getElementById('loading');
        const guideMarker = document.getElementById('guideMarker');
        const guideVisible = guideMarker?.classList.contains('visible');
        if (!guideVisible) {
            if (loadingOverlay) {
                loadingOverlay?.classList.add('visible');
            }
        }

        // 今回表すモデルの表示
        const objects = await ctx.loader.loadAsync(modelPath);

        const model = objects.scene;
        model.scale.set(scale, scale, scale);
        // 詳細オブジェクトの表示状態をboolean値で設定
        model.userData.isDetail = true;
        ctx.scene.add(model);

        // ソースダイナーのモデルにのみシェーディング処理を適用
        if (modelPath.includes('theSourceDiner')) {
            model.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    if (obj.name = 'Plate') {
                        obj.geometry.computeVertexNormals();
                    } else {
                        obj.material.flatShading = true;
                        obj.material.needsUpdate = true;
                    }
                }
            });
        }
        // 配列に保存
        ctx.objectList.push(model);
        const nowModel = model;

        // ローディングインジケーターを非表示
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('visible');
                // 初回だけ無条件で表示を行う
                // if (ctx.detailNum == 0) {
                // ctx.camera.layers.enable(1);
                // ctx.detailNum += 1;
                // }
            }, 100);
        }

        return nowModel;
    } catch(error) {
        const loadingOverlay = document.getElementById('loading');
        if(loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('visible');
            }, 100);
        }
        alert(error +'モデルの読み込みに失敗しました。');
        console.log(error);
        return null;
    }
}

// GLB・GLTFモデルの各要素事分解してメモリの解放を行う関数。
export function disposeModel(targetModel: THREE.Group<THREE.Object3DEventMap>) {
    targetModel.traverse(function (obj) {
        // objにはtargetModelが入る
        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose(); // ジオメトリの解放
            if (obj.material.isMaterial) {
                obj.material.dispose(); // 単一マテリアルの解放
            } else {
                for (const material of obj.material) {
                    material.dispose(); // マルチマテリアルの解放
                }
            }
            if (obj.material.map) {
                obj.material.map.dispose(); // テクスチャの解放
            }
        }
    });
};