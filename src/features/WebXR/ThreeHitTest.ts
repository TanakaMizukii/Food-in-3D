import * as THREE from 'three';
import { ThreeCtx } from "./ThreeInit";
import type { RefObject } from 'react';
import type { ModelDisplaySettings } from '@/data/types';

export function updateHitTest(ctx: ThreeCtx, frame: XRFrame | undefined) {
    if (!frame || !ctx.hitTestSource) return;

    const hitTestResults = frame.getHitTestResults(ctx.hitTestSource);
    if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const referenceSpace = ctx.renderer.xr.getReferenceSpace();
        if (referenceSpace) {
            const pose = hit.getPose(referenceSpace);
            if (pose) {
                ctx.reticle.visible = true;
                ctx.reticle.matrix.fromArray(pose.transform.matrix);
            }
        }
    } else {
        ctx.reticle.visible = false;
    }

    // Raycaster for reticle transparency
    const cameraDirection = new THREE.Vector3();
    ctx.camera.getWorldDirection(cameraDirection);
    ctx.raycaster.set(ctx.camera.position, cameraDirection);

    const intersects = ctx.raycaster.intersectObjects(ctx.objectList, true);

    if (intersects.length > 0) {
        // Make reticle semi-transparent if it's behind an object
        (ctx.reticle.material as THREE.Material).opacity = 0.1;
    } else {
        // Otherwise, make it fully opaque
        (ctx.reticle.material as THREE.Material).opacity = 1.0;
    }
}

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; displaySettings?: ModelDisplaySettings; };

export async function handleFirstHit(
    ctx: ThreeCtx,
    timestamp: DOMHighResTimeStamp,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>,
    firstModelInfo?: ModelInfo,
    onLoad?: (info: ModelInfo) => Promise<void>,
) {
    if (viewNumRef.current !== 0) {
        return;
    }

    const isVisible = ctx.reticle.visible;

    if (isVisible) {
        // 平面検出時：スキャン画面を非表示にしてメニュー・ボタンを表示
        const scanningOverlay = document.getElementById('scanning-overlay');
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        const menuContainer = document.getElementById('menu-container') || document.getElementById('compact-menu-container');
        if (scanningOverlay) scanningOverlay.style.display = 'none';
        if (arUI) arUI.style.display = 'block';
        if (exitButton) exitButton.style.display = 'block';
        if (menuContainer) menuContainer.style.display = 'flex';

        if (reticleShowTimeRef.current === null) {
            reticleShowTimeRef.current = timestamp;
        }

        if (reticleShowTimeRef.current !== null && timestamp - reticleShowTimeRef.current > 1500) {
            viewNumRef.current = 1;
            reticleShowTimeRef.current = null;
            await onLoad?.(firstModelInfo ?? {});
            // モデルロード完了後：メニューオープンガイドとアクションボタンを表示
            const openPanel = document.getElementById('menu-openGuide') || document.getElementById('compact-menu-openGuide');
            const groupActions = document.getElementById('group-actions');
            const clearObjects = document.getElementById('clear-objects');
            const resetHit = document.getElementById('reset-hit');
            if (openPanel) openPanel.style.display = 'flex';
            if (groupActions) groupActions.style.display = 'flex';
            if (clearObjects) clearObjects.style.display = 'flex';
            if (resetHit) resetHit.style.display = 'flex';
        }
    } else {
        reticleShowTimeRef.current = null;
    }
}