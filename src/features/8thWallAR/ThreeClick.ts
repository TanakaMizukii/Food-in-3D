/**
 * 8thWallAR クリックハンドラ
 * WebXR の ThreeClick.ts と同じギズモ（TransformControls）動作:
 *   - モデルをクリック: ギズモ表示 + 詳細パネルトグル
 *   - 選択中モデルを再クリック: ギズモ非表示 + 詳細パネル表示
 *   - 空白をクリック: ギズモ非表示
 */
import * as THREE from 'three';
import type { SceneState } from './ThreeLoad';

export function handleClick(state: SceneState) {
    return (event: MouseEvent) => {
        const element = event.currentTarget as HTMLElement | null;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, state.camera);
        const intersects = raycaster.intersectObjects(state.objectList, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;
            // シーン直下の最上位親を取得
            while (clickedObject.parent && clickedObject.parent !== state.scene) {
                clickedObject = clickedObject.parent;
            }

            if (state.transControls.object === clickedObject) {
                // 選択中を再クリック: 解除して詳細パネルを表示
                state.gizmo.visible = false;
                state.transControls.detach();
                clickedObject.userData.isDetail = true;
                state.camera.layers.enable(1);
            } else {
                // 新規選択
                state.transControls.attach(clickedObject);
                state.gizmo.visible = true;

                if (clickedObject.userData.isDetail === undefined) {
                    clickedObject.userData.isDetail = false;
                }
                clickedObject.userData.isDetail = !clickedObject.userData.isDetail;

                if (clickedObject.userData.isDetail) {
                    state.camera.layers.enable(1);
                } else {
                    state.camera.layers.disable(1);
                }
            }
        } else {
            // 空白クリック: 選択解除
            if (state.transControls.object) {
                state.transControls.detach();
                state.gizmo.visible = false;
            }
        }
    };
}
