import * as THREE from 'three';
import type { ThreeCtx } from './ThreeInit';

// クリックするたびに 0→1→2→0... とサイクルする:
//   0: 詳細パネル表示・ギズモ非表示
//   1: 詳細パネル非表示・ギズモ表示（水平移動）
//   2: 詳細パネル・ギズモ非表示（観察モード）
//   空白クリック: 全解除
//
// attach()/detach() は ThreeClick.ts では使用しない。
// attach はモデルロード側で一度だけ行う。

function applyClickState(_clickedObject: THREE.Object3D, ctx: ThreeCtx, clickState: number) {
    if (clickState === 0) {
        ctx.gizmo.visible = false;
        ctx.camera.layers.enable(1);
    } else if (clickState === 1) {
        ctx.gizmo.visible = true;
        ctx.camera.layers.disable(1);
    } else {
        ctx.gizmo.visible = false;
        ctx.camera.layers.disable(1);
    }
}

export function handleClick(ctx: ThreeCtx) {
    let focusedObject: THREE.Object3D | null = null;

    return (event: MouseEvent) => {
        const element = event.currentTarget as HTMLElement | null;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        ctx.mouse.x = (x / w) * 2 - 1;
        ctx.mouse.y = -(y / h) * 2 + 1;

        ctx.raycaster.setFromCamera(ctx.mouse, ctx.camera);
        const intersects = ctx.raycaster.intersectObjects(ctx.objectList, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;
            while (clickedObject.parent && clickedObject.parent !== ctx.scene) {
                clickedObject = clickedObject.parent;
            }

            if (focusedObject !== clickedObject) {
                if (focusedObject) focusedObject.userData.clickCount = 0;
                focusedObject = clickedObject;
                clickedObject.userData.clickCount = 0;
            } else {
                const prev = clickedObject.userData.clickCount ?? 0;
                clickedObject.userData.clickCount = (prev + 1) % 3;
            }

            applyClickState(clickedObject, ctx, clickedObject.userData.clickCount);
        } else {
            // 空白クリック: 全解除
            if (focusedObject) {
                focusedObject.userData.clickCount = 0;
                focusedObject = null;
            }
            ctx.gizmo.visible = false;
            ctx.camera.layers.disable(1);
        }
    };
}
