import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { PMREMGenerator } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { LightSettings } from '../../data/types';
await MeshoptDecoder.ready;

export type ThreeCtx = {
    renderer: WebGPURenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    loader: GLTFLoader;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    detailNum: number;
    objectList: THREE.Object3D[];
    dispose: () => void;
};

export type InitOptions = {
    pixelRatioCap?: number; // モバイル負荷対策
    alpha?: boolean;
    antialias?: boolean;
    useControls?: boolean;
    hdrPath?: string;
    hdrFile?: string;
    cameraPosition?: [number, number, number];
    controlsTarget?: [number, number, number];
    lightSettings?: LightSettings;
};

/** Three.js 初期化（canvas必須） */
export async function initThree(canvas: HTMLCanvasElement, opts: InitOptions = {}): Promise<ThreeCtx> {
    // デフォルト値を分割代入にて設定(もし値がなかった時自動的に入る)
    const {
        pixelRatioCap = 2,
        alpha = false,
        antialias = true,
        useControls = false,
        hdrPath = '/hdr/denden/',
        hdrFile = 'denden_2.1_small.hdr',
        cameraPosition = [0.34, 0.77, 0.49],
        controlsTarget = [0, 0.05, 0],
        lightSettings,
    } = opts;

    const ambientLightIntensity = lightSettings?.ambientLightIntensity ?? 0.8;
    const directionalLightIntensity = lightSettings?.directionalLightIntensity ?? 0.5;
    const toneMappingExposure = lightSettings?.toneMappingExposure ?? 0.8;

    const renderer = new WebGPURenderer({
        canvas,
        antialias,
        alpha, // 透過
        powerPreference: "high-performance",
    });
    // WebGPU非対応ブラウザでは自動的にWebGLバックエンドにフォールバックする
    await renderer.init();

    // Blenderの見え方と合わせるための設定
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = toneMappingExposure;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

    // 簡易ライト
    const amLight = new THREE.AmbientLight(0xfffffff, ambientLightIntensity);
    const diLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
    diLight.position.set( 1, 1, 1).normalize;
    scene.add(diLight);
    scene.add(amLight);

    let controls: OrbitControls | undefined;
    if (useControls) {
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        controls.target.set(controlsTarget[0], controlsTarget[1], controlsTarget[2]);
        console.log(controls.target);
    }

    // const helper = new THREE.AxesHelper(100);
    // scene.add(helper);

    // モデルデータを読み込むためのローダーを作成
    // KTX2を準備
    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('/basis/');
    ktx2.detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2);
    loader.setMeshoptDecoder(MeshoptDecoder);

    // マウスの位置を格納するベクトルを作成
    const mouse = new THREE.Vector2(-100, -100); // 初期値を画面外に設定
    // レイキャストの作成(初期値の設定)
    const raycaster = new THREE.Raycaster();
    const detailNum = 0;
    const objectList: never[] = [];

    // DevicePixelRatio制限(初期値１)
    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    renderer.setPixelRatio(dpr);

    // クリーンナップ関数
    const dispose = () => {
        controls?.dispose();
        scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = mesh.material;
            if (mat) {
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
                else mat.dispose?.();
            }
        });
        renderer.dispose();
    };

    const pmrem = new PMREMGenerator(renderer);
    await pmrem.compileCubemapShader();
    new HDRLoader()
    .setPath(hdrPath)
    .load(hdrFile, (hdr) => {
        const envTex = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envTex;
        scene.background = envTex;
        hdr.dispose();
        // pmrem.dispose(); // 背景を頻繁に変える場合は有効化
    });

    return { renderer, scene, camera, controls, loader, mouse, raycaster, detailNum, objectList, dispose };
}

/** リサイズ処理 ResizeObserver + window.resize をまとめてセットアップ */
export function attachResizeHandlers(ctx: ThreeCtx, container: HTMLElement, opts?: { pixelRatioCap?: number }) {
    const onResize = () => {
        refreshPixelRatio(ctx.renderer, opts?.pixelRatioCap ?? 2);
        resizeToContainer(ctx, container);
    };
    // ResizeObserver(関数)は指定した要素の親要素のサイズ変化を感知して設置した関数を発動するブラウザAPI。
    const ro = new ResizeObserver(onResize);
    // .observe(targetElement)にて監視対象の要素を登録。引数にはHTMLElement(div,canvas)などを渡す。
    ro.observe(container);
    window.addEventListener("resize", onResize, { passive: true });

    // 初回適用
    onResize();

    // これはクリーンナップ関数というもので、1,コンポーネントがDOMから完全に削除されるとき
    // 依存配列の値が変わるとき（useEffect(..., [依存値]) の依存値が変化して再実行される前）
    // つまり、useEffectが次に実行される前に必ず呼ばれる処理である。
    return () => {
        // 監視対象を完全に解除するメソッド
        ro.disconnect();
        window.removeEventListener("resize", onResize);
    };
}

/** DPRを再適用（回転等でDPRが変わる端末対策用） */
export function refreshPixelRatio(renderer: WebGPURenderer, cap = 2) {
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(dpr);
}

/** 親要素サイズにフィットさせる */
export function resizeToContainer(ctx: ThreeCtx, container: HTMLElement) {
    const width = container.clientWidth;
    const height = container.clientHeight || 1; // 0除け
    ctx.camera.aspect = width / height;
    ctx.camera.updateProjectionMatrix();
    ctx.renderer.setSize(width, height, false);
}