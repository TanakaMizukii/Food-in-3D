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

// 標準モジュールの登録済みフラグ（ページライフタイムで一度だけ登録する）
let standardModulesAdded = false;

/** カスタムシーンモジュールの name（removeCameraPipelineModule で使用） */
const SCENE_MODULE_NAME = 'foodARScene';

/**
 * XR8 のカメラパイプラインに各モジュールを登録して AR を開始する。
 * 初回: 全モジュールを登録して XR8.run()
 * 2回目以降: シーンモジュールのみ入れ替えて XR8.run()（標準モジュールは重複登録しない）
 */
export function startXR8Pipeline({ canvas, scenePipelineModule }: StartXR8PipelineParams): void {
    // XR8.Threejs.pipelineModule() が呼ばれる前に window.THREE を設定する必要がある
    window.THREE = THREE;

    if (!standardModulesAdded) {
        // 初回: 標準モジュール + シーンモジュールをまとめて登録
        const modules: XR8PipelineModule[] = [
            XR8.GlTextureRenderer.pipelineModule(),     // カメラ映像（フィード）を描画する
            XR8.Threejs.pipelineModule(),               // ThreeJS の AR シーンを生成する
            XR8.XrController.pipelineModule(),          // SLAM トラッキングを有効化する
            XRExtras.FullWindowCanvas.pipelineModule(), // canvas をウィンドウ全体にフィットするよう調整する
            XRExtras.Loading.pipelineModule(),          // 起動時のローディング画面を管理する
            XRExtras.RuntimeError.pipelineModule(),     // 実行時エラーが起きた際にエラー画像を表示する
            scenePipelineModule,
        ];
        if (window.LandingPage) {
            modules.splice(3, 0, window.LandingPage.pipelineModule());
        }
        XR8.addCameraPipelineModules(modules);
        standardModulesAdded = true;
    } else {
        // 2回目以降: 古いシーンモジュールを除去して新しいものに差し替える
        try {
            XR8.removeCameraPipelineModule(SCENE_MODULE_NAME);
        } catch {
            // 未登録の場合は無視
        }
        XR8.addCameraPipelineModules([scenePipelineModule]);
    }

    XR8.run({ canvas });
}
