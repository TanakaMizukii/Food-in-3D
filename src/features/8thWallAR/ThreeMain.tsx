'use client';

/**
 * 8thWallAR メイン React コンポーネント
 * xr.js / xrextras.js / landing-page.js を動的に読み込み、
 * XR8 パイプラインを起動して AR を開始する。
 */
import '@/types/xr8Types';
import styled from 'styled-components';
import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ARHelper from '@/components/AR/ARHelper';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';
import { initScenePipelineModule, type ModelProps } from './ThreeInit';
import { startXR8Pipeline } from './XR8Pipeline';
import type { StoreInfo, ModelDisplaySettings } from '@/data/types';

type ModelInfo = {
    modelName?: string;
    modelPath?: string;
    modelDetail?: string;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    onCameraReady: () => void;
    onPlaneDetected: () => void;
    onInitialModelLoaded: () => void;
    onLoadingChange?: (loading: boolean) => void;
    onLoadingProgress?: (progress: number) => void;
    storeInfo: StoreInfo | null;
};

type ScriptEntry = { src: string; attrs?: Record<string, string> };

// 読み込む外部スクリプト（public/8thWallAR/external/ に配置されていること）
// xr.js には data-preload-chunks="slam" が必要（XR8.XrController を含む SLAM モジュールを内部ロードさせる）
const EXTERNAL_SCRIPTS: ScriptEntry[] = [
    { src: '/8thWallAR/external/xrextras/xrextras.js' },
    { src: '/8thWallAR/external/landing-page/landing-page.js' },
    { src: '/8thWallAR/external/xr/xr.js', attrs: { 'data-preload-chunks': 'slam' } },
];

/** スクリプトを順番に読み込む（既に読み込み済みのものはスキップ） */
function loadScript({ src, attrs }: ScriptEntry): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        if (attrs) {
            for (const [key, val] of Object.entries(attrs)) {
                script.setAttribute(key, val);
            }
        }
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

export default function ThreeMain({
    setChangeModel,
    onCameraReady,
    onPlaneDetected,
    onInitialModelLoaded,
    onLoadingChange,
    onLoadingProgress,
    storeInfo,
}: ThreeMainProps) {
    const router = useRouter();
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // scenePipelineModule を ref で保持（changeModel から参照するため）
    const scenePipelineRef = useRef<ReturnType<typeof initScenePipelineModule> | null>(null);

    const onLoadingProgressRef = useRef(onLoadingProgress);
    useEffect(() => { onLoadingProgressRef.current = onLoadingProgress; }, [onLoadingProgress]);

    const changeModel = useCallback(async (info: ModelInfo): Promise<void> => {
        if (!scenePipelineRef.current) return;
        onLoadingChange?.(true);
        const modelProps: ModelProps = {
            modelPath: info.modelPath,
            modelName: info.modelName,
            modelDetail: info.modelDetail,
            modelPrice: info.modelPrice,
            displaySettings: info.displaySettings ?? storeInfo?.firstEnvironment?.modelDisplaySettings,
        };
        await (scenePipelineRef.current as { changeModel: (p: ModelProps) => Promise<void> }).changeModel(modelProps);
        onLoadingChange?.(false);
    }, [onLoadingChange, storeInfo]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        let mounted = true;

        const init = async () => {
            // xrloaded イベントを xr.js 読み込み前に登録しておく
            // （xr.js の onload より xrloaded 発火が遅れる場合があるため Promise でラップ）
            const xrReadyPromise = new Promise<void>((resolve) => {
                window.addEventListener('xrloaded', () => resolve(), { once: true });
            });

            // 外部スクリプトを順番に読み込む
            for (const src of EXTERNAL_SCRIPTS) {
                await loadScript(src);
                if (!mounted) return;
            }

            // xrloaded イベント（XR8 + 全サブモジュールの完全初期化）を待つ
            await xrReadyPromise;
            if (!mounted || !canvasRef.current) return;

            // パイプラインモジュール生成
            const scenePipeline = initScenePipelineModule({
                storeInfo,
                onCameraReady,
                onPlaneDetected,
                onInitialModelLoaded,
                onLoadingChange,
                onLoadingProgress: onLoadingProgressRef.current,
            });
            scenePipelineRef.current = scenePipeline;

            startXR8Pipeline({ canvas: canvasRef.current, scenePipelineModule: scenePipeline });
        };

        init().catch((err) => {
            console.error('8thWallAR init error:', err);
        });

        return () => {
            mounted = false;
            // パイプラインのクリーンアップ
            if (scenePipelineRef.current) {
                (scenePipelineRef.current as { cleanup?: () => void }).cleanup?.();
                scenePipelineRef.current = null;
            }
            // XR8セッションを停止（カメラとアニメーションループを終了させる）
            try {
                if (typeof XR8 !== 'undefined') {
                    XR8.stop();
                }
            } catch (e) {
                console.warn('XR8.stop() failed:', e);
            }
            // XRExtras.FullWindowCanvas が body/html に注入したスタイルをリセット
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.documentElement.style.overflow = '';
        };
    // storeInfo が変わったときだけ再初期化
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeInfo]);

    const handleExit = () => {
        router.push(`/${locale}/${nowStore}/viewer`);
    };

    const handleClear = () => {
        if (scenePipelineRef.current) {
            (scenePipelineRef.current as { clearModel?: () => void }).clearModel?.();
        }
    };

    const handleReset = () => {
        // 8th Wall では XR8 セッションを再起動することでリセット相当の操作になる
        // シンプルにページリロードで対応
        window.location.reload();
    };

    return (
        <>
            <ARHelper
                onExit={handleExit}
                onClear={handleClear}
                onReset={handleReset}
                showClearObjects={true}
                showResetHit={true}
            />
            <MyCanvas id="camerafeed" ref={canvasRef} />
        </>
    );
}

const MyCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
`;
