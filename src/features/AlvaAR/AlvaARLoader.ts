/**
 * AlvaAR WASM動的ローダー
 * public/alvaAR/alva_ar.js をスクリプトとして動的にロードし、AlvaARインスタンスを返す
 */

export interface AlvaARPoint {
    x: number;
    y: number;
}

export interface IMUOrientation {
    w: number;
    x: number;
    y: number;
    z: number;
}

export interface IMUMotionSample {
    timestamp: number;
    gx: number; gy: number; gz: number;
    ax: number; ay: number; az: number;
}

export interface AlvaARInstance {
    findCameraPose(imageData: ImageData): Float32Array | null;
    findCameraPoseWithIMU(
        frame: ImageData,
        orientation: IMUOrientation,
        motion: IMUMotionSample[],
    ): Float32Array | null;
    findPlane(numIterations?: number): Float32Array | null;
    getFramePoints(): AlvaARPoint[];
    reset(): void;
}

interface AlvaARStatic {
    Initialize(width: number, height: number): Promise<AlvaARInstance>;
}

declare global {
    interface Window {
        AlvaAR?: AlvaARStatic;
    }
}

/**
 * AlvaAR WASMスクリプトをロードし、初期化済みインスタンスを返す
 */
export async function loadAlvaAR(width: number, height: number): Promise<AlvaARInstance> {
    // まだスクリプトがロードされていない場合は動的importでロード
    if (!window.AlvaAR) {
        // @ts-ignore: public配下の動的ロード
        const module = await import(/* webpackIgnore: true */ '/alvaAR/alva_ar.js');
        if (module.AlvaAR) {
            window.AlvaAR = module.AlvaAR;
        }
    }

    if (!window.AlvaAR) {
        throw new Error('AlvaAR が見つかりません');
    }

    return window.AlvaAR.Initialize(width, height);
}
