/**
 * 8thWallAR XR8 パイプライン起動
 * index.js を TypeScript 化したもの。
 * XR8 のカメラパイプラインモジュールを登録して AR を開始する。
 */
import '@/types/xr8Types';
import * as THREE from 'three';
import type { XR8PipelineModule } from './ThreeInit';

export type StartXR8PipelineParams = {
    canvas: HTMLCanvasElement;
    /** initScenePipelineModule() が返すカスタムモジュール */
    scenePipelineModule: XR8PipelineModule;
};

/**
 * XR8 のカメラパイプラインに各モジュールを登録して AR を開始する。
 * この関数は `xrloaded` イベント発火後（XR8 が利用可能になった後）に呼ぶこと。
 */
export function startXR8Pipeline({ canvas, scenePipelineModule }: StartXR8PipelineParams): void {
    // XR8.Threejs.pipelineModule() が呼ばれる前に window.THREE を設定する必要がある
    window.THREE = THREE;

    const modules: XR8PipelineModule[] = [
        XR8.GlTextureRenderer.pipelineModule(),     // カメラ映像（フィード）を描画する
        XR8.Threejs.pipelineModule(),               // ThreeJS の AR シーンを生成する
        XR8.XrController.pipelineModule(),          // SLAM トラッキングを有効化する
        XRExtras.FullWindowCanvas.pipelineModule(), // canvas をウィンドウ全体にフィットするよう調整する
        XRExtras.Loading.pipelineModule(),          // 起動時のローディング画面を管理する
        XRExtras.RuntimeError.pipelineModule(),     // 実行時エラーが起きた際にエラー画像を表示する
        scenePipelineModule,                        // Three.js のカメラとシーン内容を初期化する
    ];

    // landing-page.js のロードに成功していれば追加（非対応ブラウザ向けヒント表示）
    if (window.LandingPage) {
        modules.splice(3, 0, window.LandingPage.pipelineModule());
    }

    XR8.addCameraPipelineModules(modules);

    XR8.run({ canvas });
}
