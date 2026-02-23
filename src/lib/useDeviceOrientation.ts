'use client';
import { useRef, useEffect, useCallback, useState } from 'react';

export type OrientationDelta = {
    deltaBeta: number;   // 前後傾き差分（度）
    deltaGamma: number;  // 左右傾き差分（度）
};

export type UseDeviceOrientationReturn = {
    /** アニメーションループから再レンダーなしに読めるref */
    orientationRef: React.RefObject<OrientationDelta>;
    /** センサーあり・権限済みの場合 true */
    isSupported: boolean;
};

// TypeScript の DOM 型に requestPermission が含まれないため追加して拡張
type DeviceOrientationEventStatic = typeof DeviceOrientationEvent & {
    // ?にするのはAndroidやPCには存在しないから
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

const SESSION_KEY = 'imu_permission';

/**
 * StoreStartPanel のスタートボタン onClick から呼ぶ。
 * iOS 13+ は OS の権限ダイアログを出し、結果を sessionStorage に保存する。
 * Android / その他は即座に 'granted' を保存して返る。
 * ユーザージェスチャー（click イベント）の中から呼ぶこと。
 */
export async function requestIMUPermission(): Promise<void> {
    if (typeof window === 'undefined') return;

    const DOES = DeviceOrientationEvent as DeviceOrientationEventStatic;

    if (typeof DOES.requestPermission === 'function') {
        // iOS 13+ — OS ダイアログを表示
        try {
            const result = await DOES.requestPermission();
            if (result === 'granted') {
                sessionStorage.setItem(SESSION_KEY, 'granted');
            }
        } catch (err) {
            console.warn('[IMU] Permission request failed:', err);
        }
    } else {
        // Android / desktop — 権限不要、そのまま許可扱い
        sessionStorage.setItem(SESSION_KEY, 'granted');
    }
}

/**
 * 3DViewerの animation ループ内で端末傾きを読むためのフック。
 * StoreStartPanel で requestIMUPermission() を先に呼んでおくことを前提とする。
 */
export function useDeviceOrientation(): UseDeviceOrientationReturn {
    // アニメーションループが読む hot-path ref（再レンダーを起こさない）
    const orientationRef = useRef<OrientationDelta>({ deltaBeta: 0, deltaGamma: 0 });

    // 初回受信値をニュートラル基準として保存
    const baselineRef = useRef<{ beta: number; gamma: number } | null>(null);

    const [isSupported, setIsSupported] = useState(false);

    // イベントリスナー本体
    const attachListener = useCallback(() => {
        const handler = (e: DeviceOrientationEvent) => {
            const beta  = e.beta  ?? 0;
            const gamma = e.gamma ?? 0;

            // 初回値をニュートラルとして記録
            if (baselineRef.current === null) {
                baselineRef.current = { beta, gamma };
            }

            orientationRef.current = {
                deltaBeta:  beta  - baselineRef.current.beta,
                deltaGamma: gamma - baselineRef.current.gamma,
            };
        };

        window.addEventListener('deviceorientation', handler, { passive: true });
        return () => window.removeEventListener('deviceorientation', handler);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.DeviceOrientationEvent) return;

        // StoreStartPanel で許可済みの場合はすぐにリスナーを貼る
        if (sessionStorage.getItem(SESSION_KEY) === 'granted') {
            setIsSupported(true);
            const cleanup = attachListener();
            return cleanup;
        }

        // 直接 viewer に来た場合（スタートパネルをスキップ）のフォールバック:
        // iOS 13+ 以外（Android 等）は権限なしでも試みる
        const DOES = DeviceOrientationEvent as DeviceOrientationEventStatic;
        if (typeof DOES.requestPermission === 'function') {
            // iOS 13+ — storeStartPanel を経由していない場合は何もしない
            return;
        }

        // Android / その他 — プローブして実データが来たら有効化
        let probeCleanup: (() => void) | null = null;

        const probe = (e: DeviceOrientationEvent) => {
            if (e.beta !== null || e.gamma !== null) {
                setIsSupported(true);
                probeCleanup = attachListener();
            }
        };

        window.addEventListener('deviceorientation', probe, { once: true, passive: true });

        const timeout = window.setTimeout(() => {
            window.removeEventListener('deviceorientation', probe);
        }, 1000);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('deviceorientation', probe);
            probeCleanup?.();
        };
    }, [attachListener]);

    return { orientationRef, isSupported };
}
