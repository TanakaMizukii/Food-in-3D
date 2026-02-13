/**
 * AlvaAR用クリック処理
 * ARjsのThreeClick.tsをベースに、detail表示切替のみ実装
 */
import type { ThreeCtx } from './ThreeInit';

export function handleClick(ctx: ThreeCtx) {
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
            event.stopPropagation();
            let clickedObject = intersects[0].object;
            // グループの最上位親を選択
            while (clickedObject.parent && clickedObject.parent !== ctx.scene) {
                clickedObject = clickedObject.parent;
            }

            if (clickedObject.userData.isDetail === undefined) {
                clickedObject.userData.isDetail = true;
            }
            clickedObject.userData.isDetail = !clickedObject.userData.isDetail;

            const detailElement = document.querySelector('.detail');
            if (detailElement) {
                (detailElement as HTMLElement).style.visibility =
                    clickedObject.userData.isDetail ? 'visible' : 'hidden';
            }
        }
    };
}
