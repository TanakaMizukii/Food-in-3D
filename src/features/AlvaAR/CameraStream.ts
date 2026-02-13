/**
 * カメラストリーム管理 + フレームループユーティリティ
 * 既存 assets/utils.js のCamera/onFrame/resize2coverのTypeScript変換
 */

export interface CameraMedia {
    el: HTMLVideoElement;
    width: number;
    height: number;
}

/**
 * カメラを初期化し、video要素を返す
 */
export async function initCamera(constraints: MediaStreamConstraints): Promise<CameraMedia> {
    // 権限チェック
    let permission: PermissionStatus | null = null;
    if (navigator.permissions?.query) {
        try {
            permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        } catch {
            // Permissions API非対応の場合は無視
        }
    }

    if (permission?.state === 'denied') {
        throw new Error('カメラのアクセスが拒否されています');
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const track = stream.getVideoTracks()[0];

    if (!track) {
        throw new Error('カメラのビデオトラックが見つかりません');
    }

    const video = document.createElement('video');
    video.setAttribute('autoplay', 'autoplay');
    video.setAttribute('playsinline', 'playsinline');
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.srcObject = stream;

    return new Promise<CameraMedia>((resolve, reject) => {
        video.onloadedmetadata = () => {
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            video.style.width = vw + 'px';
            video.style.height = vh + 'px';
            video.width = vw;
            video.height = vh;
            video.play();
            resolve({ el: video, width: vw, height: vh });
        };
        video.onerror = () => reject(new Error('カメラの映像読み込みに失敗しました'));
    });
}

/**
 * 固定FPSのフレームループ
 * callback が false を返すとループ停止
 */
export function onFrame(callback: (timestamp: number) => boolean | Promise<boolean>, fps = 30): void {
    const fpsInterval = ~~(1000 / fps);
    let t1 = performance.now();

    const onAnimationFrame = async () => {
        const t2 = performance.now();
        const td = t2 - t1;

        if (td > fpsInterval) {
            t1 = t2 - (td % fpsInterval);

            if ((await callback(t2)) === false) {
                return;
            }
        }

        requestAnimationFrame(onAnimationFrame);
    };

    requestAnimationFrame(onAnimationFrame);
}

export interface CoverRect {
    width: number;
    height: number;
    x: number;
    y: number;
}

/**
 * アスペクト比を保ったまま、中央寄せで全面に覆うための拡大・配置計算
 */
export function resize2cover(srcW: number, srcH: number, dstW: number, dstH: number): CoverRect {
    if (dstW / dstH > srcW / srcH) {
        const scale = dstW / srcW;
        const width = ~~(scale * srcW);
        const height = ~~(scale * srcH);
        return { width, height, x: 0, y: ~~((dstH - height) * 0.5) };
    } else {
        const scale = dstH / srcH;
        const width = ~~(scale * srcW);
        const height = ~~(scale * srcH);
        return { width, height, x: ~~((dstW - width) * 0.5), y: 0 };
    }
}

/**
 * カメラストリームを停止する
 */
export function stopCamera(video: HTMLVideoElement): void {
    const stream = video.srcObject;
    if (stream instanceof MediaStream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
}
