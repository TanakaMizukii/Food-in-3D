/**
 * 8thWallAR クリックハンドラ
 * モデルをクリックするたびに 0→1→2→3→0... とサイクルする:
 *   0: 詳細パネル表示・ギズモ非表示
 *   1: 詳細パネル非表示・Y軸回転ギズモ表示
 *   2: 詳細パネル非表示・水平移動ギズモ表示
 *   3: 詳細パネル・ギズモ非表示（観察モード）
 *   空白クリック: 全解除（state 0 に戻る）
 */
import * as THREE from 'three';
import type { SceneState } from './ThreeLoad';

function applyClickState(_clickedObject: THREE.Object3D, state: SceneState, clickState: number) {
    if (clickState === 0) {
        state.gizmo.visible = false;
        state.camera.layers.enable(1);
    } else if (clickState === 1) {
        state.transControls.setMode('rotate');
        state.transControls.showX = false;
        state.transControls.showY = true;
        state.transControls.showZ = false;
        state.gizmo.visible = true;
        state.camera.layers.disable(1);
    } else if (clickState === 2) {
        state.transControls.setMode('translate');
        state.transControls.showX = true;
        state.transControls.showY = false;
        state.transControls.showZ = true;
        state.gizmo.visible = true;
        state.camera.layers.disable(1);
    } else {
        state.gizmo.visible = false;
        state.camera.layers.disable(1);
    }
}

export function handleClick(state: SceneState) {
    // transControls.object は detach() で undefined になるため、
    // 選択オブジェクトをクロージャ変数で管理する
    let focusedObject: THREE.Object3D | null = null;

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
            while (clickedObject.parent && clickedObject.parent !== state.scene) {
                clickedObject = clickedObject.parent;
            }

            if (focusedObject !== clickedObject) {
                // 別のオブジェクトをクリック: state 0 からスタート
                if (focusedObject) focusedObject.userData.clickCount = 0;
                focusedObject = clickedObject;
                clickedObject.userData.clickCount = 0;
            } else {
                // 同じオブジェクトを再クリック: 次の state へ
                const prev = clickedObject.userData.clickCount ?? 0;
                clickedObject.userData.clickCount = (prev + 1) % 4;
            }

            applyClickState(clickedObject, state, clickedObject.userData.clickCount);
        } else {
            // 空白クリック: 全解除
            if (focusedObject) {
                focusedObject.userData.clickCount = 0;
                focusedObject = null;
            }
            state.gizmo.visible = false;
            state.camera.layers.disable(1);
        }
    };
}
