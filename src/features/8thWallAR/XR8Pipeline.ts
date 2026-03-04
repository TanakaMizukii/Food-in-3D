/**
 * 8thWallAR XR8 パイプライン起動
 * index.js を TypeScript 化したもの。
 * XR8 のカメラパイプラインモジュールを登録して AR を開始する。
 */
import './xr8Types';
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
    XR8.addCameraPipelineModules([
        XR8.GlTextureRenderer.pipelineModule(),     // カメラ映像（フィード）を描画する
        XR8.Threejs.pipelineModule(),               // ThreeJS の AR シーンを生成する
        XR8.XrController.pipelineModule(),          // SLAM トラッキングを有効化する
        window.LandingPage.pipelineModule(),        // 非対応ブラウザを検出し、ヒントを表示する
        XRExtras.FullWindowCanvas.pipelineModule(), // canvas をウィンドウ全体にフィットするよう調整する
        XRExtras.Loading.pipelineModule(),          // 起動時のローディング画面を管理する
        XRExtras.RuntimeError.pipelineModule(),     // 実行時エラーが起きた際にエラー画像を表示する
        scenePipelineModule,                        // Three.js のカメラとシーン内容を初期化する
    ]);

    XR8.run({ canvas });
}
