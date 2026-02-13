/**
 * AlvaAR用 Three.js初期化
 * ARjsのThreeInit.tsをベースに、AR.js固有部分をAlvaAR用に置換
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { PMREMGenerator } from 'three';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

await MeshoptDecoder.ready;

/** AlvaAR用のThree.jsコンテキスト型 */
export type ThreeCtx = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    labelRenderer: CSS2DRenderer;
    loader: GLTFLoader;
    reticle: THREE.Mesh;
    videoCanvas: HTMLCanvasElement;
    videoCtx: CanvasRenderingContext2D;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    detailNum: number;
    objectList: THREE.Object3D[];
    nowModel: THREE.Group | null;
    dispose: () => void;
};

export type InitOptions = {
    pixelRatioCap?: number;
    alpha?: boolean;
    antialias?: boolean;
    hdrPath?: string;
    hdrFile?: string;
    lightIntensity?: number;
};

/** Three.js初期化 */
export function initThree(
    container: HTMLElement,
    canvasWidth: number,
    canvasHeight: number,
    opts: InitOptions = {},
): ThreeCtx {
    const {
        pixelRatioCap = 2,
        alpha = true,
        antialias = true,
        hdrPath = '/hdr/denden/',
        hdrFile = 'denden_2.1_small.hdr',
        lightIntensity = 1,
    } = opts;

    // WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
        alpha,
        antialias,
        powerPreference: 'high-performance',
    });
    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvasWidth, canvasHeight);
    // Blenderの見え方と合わせるための設定
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Scene / Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    scene.add(camera);

    // Lights
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, lightIntensity);
    light.position.set(1, 1, 1);
    scene.add(light);

    // CSS2DRenderer（ラベル表示用）
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(canvasWidth, canvasHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.id = 'label';
    container.appendChild(labelRenderer.domElement);

    // モデルローダー
    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('/basis/');
    ktx2.detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2);
    loader.setMeshoptDecoder(MeshoptDecoder);

    // レティクル（平面検出の視覚フィードバック）
    const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.065, 32).rotateY(Math.PI / 20),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 1.0 }),
    );
    reticle.visible = false;
    reticle.scale.set(100, 100, 100);
    scene.add(reticle);

    // カメラ映像描画用Canvas
    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = canvasWidth;
    videoCanvas.height = canvasHeight;
    const videoCtx = videoCanvas.getContext('2d', { alpha: false, desynchronized: true })!;

    // レイキャスト用
    const mouse = new THREE.Vector2(-100, -100);
    const raycaster = new THREE.Raycaster();
    const detailNum = 0;
    const objectList: THREE.Object3D[] = [];
    const nowModel: THREE.Group | null = null;

    // HDR環境マップ
    const pmrem = new PMREMGenerator(renderer);
    new HDRLoader()
        .setPath(hdrPath)
        .load(hdrFile, (hdr) => {
            const envTex = pmrem.fromEquirectangular(hdr).texture;
            scene.environment = envTex;
            hdr.dispose();
        });

    // クリーンナップ
    const dispose = () => {
        renderer.dispose();
        scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = mesh.material;
            if (mat) {
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
                else (mat as THREE.Material).dispose?.();
            }
        });
        if (labelRenderer.domElement.parentNode) {
            labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
        }
    };

    return {
        renderer, scene, camera, labelRenderer, loader,
        reticle, videoCanvas, videoCtx,
        mouse, raycaster, detailNum, objectList, nowModel,
        dispose,
    };
}

/** リサイズ処理 */
export function attachResizeHandlers(ctx: ThreeCtx, container: HTMLElement, opts?: { pixelRatioCap?: number }) {
    const onResize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, opts?.pixelRatioCap ?? 2);
        ctx.renderer.setPixelRatio(dpr);

        const width = container.clientWidth;
        const height = container.clientHeight || 1;
        ctx.camera.aspect = width / height;
        ctx.camera.updateProjectionMatrix();
        ctx.renderer.setSize(width, height, false);
        ctx.labelRenderer.setSize(width, height);
        ctx.videoCanvas.width = width;
        ctx.videoCanvas.height = height;
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize, { passive: true });

    onResize();

    return () => {
        ro.disconnect();
        window.removeEventListener('resize', onResize);
    };
}
