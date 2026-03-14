/**
 * 8th Wall (XR8) グローバル型宣言
 * xr.js, xrextras.js, landing-page.js は script タグで動的に読み込まれるため、
 * window 上のグローバル変数として型定義する
 */

export type XR8HitResult = {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    type: string;
};

export type XR8CameraProjectionMatrixParams = {
    origin: { x: number; y: number; z: number };
    facing: { x: number; y: number; z: number; w: number };
};

export type XR8PipelineModule = {
    name?: string;
    onStart?: (params: { canvas: HTMLCanvasElement }) => void;
    onUpdate?: () => void;
    onRender?: () => void;
    onResize?: (params: { canvasWidth: number; canvasHeight: number }) => void;
    [key: string]: unknown;
};

export type XR8ThreejsScene = {
    scene: import('three').Scene;
    camera: import('three').PerspectiveCamera;
    renderer: import('three').WebGLRenderer;
};

declare global {
    interface Window {
        LandingPage?: {
            pipelineModule(): XR8PipelineModule;
        } | null;
        THREE?: typeof import('three');
    }

    const XR8: {
        addCameraPipelineModules(modules: XR8PipelineModule[]): void;
        removeCameraPipelineModule(name: string): void;
        run(params: { canvas: HTMLCanvasElement }): void;
        stop(): void;
        GlTextureRenderer: { pipelineModule(): XR8PipelineModule };
        Threejs: {
            pipelineModule(): XR8PipelineModule;
            xrScene(): XR8ThreejsScene;
        };
        XrController: {
            pipelineModule(): XR8PipelineModule;
            hitTest(x: number, y: number, types?: Array<{ type: string }>): XR8HitResult[];
            updateCameraProjectionMatrix(params: XR8CameraProjectionMatrixParams): void;
            recenter(): void;
        };
    };

    const XRExtras: {
        FullWindowCanvas: { pipelineModule(): XR8PipelineModule };
        Loading: { pipelineModule(): XR8PipelineModule };
        RuntimeError: { pipelineModule(): XR8PipelineModule };
    };
}
