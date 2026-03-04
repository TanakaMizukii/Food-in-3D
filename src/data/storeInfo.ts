import type { StoreInfo } from "./types";

const storeInfo: StoreInfo[] = [
    {
        id: 1,
        use_name: 'kaishu',
        true_name: 'ホルモン屋 海州',
        logo: '海州ロゴ.png',
        right_top: 'ファミリーセット切り抜き.png',
        left_bottom: 'カルビ盛り切り抜き.png',
        menuDisplayMode: 'standard',
        startPanelBgColor: '#000',
        startPanelTextColor: '#f5f5f5',
        firstEnvironment: {
            hdrPath: '/hdr/kaishu/',
            hdrFile: 'kaisyu_73_small.hdr',
            defaultModel: {
                name: 'カルビ盛り',
                path: '/models/kaishu/calbee_set_comp.glb',
                detail: '特上カルビ・上カルビ・並みカルビ・切り落としカルビがワンプレートでまとめて食べられます！！',
                price: '2,400 (税込 2,640)',
            },
            modelDisplaySettings: {
                scale: 1,
                scaleARjs: 0.09,
                scaleAlvaAR: 0.5,
                scale8thWallAR: 0.05,
                scaleWebXR: 0.0085,
                scale3DViewer: 1,
                detailPosition: [2, 6, -7],
                detailCenter: [0, 0.8],
            },
            cameraPosition: [0, 42, 36],
            controlsTarget: [0, 5, 0],
            lightSettings: {
                ambientLightIntensity: 0.8,
                directionalLightIntensity: 0.5,
                toneMappingExposure: 0.8,
            },
        }
    },
    {
        id: 2,
        use_name: 'denden',
        true_name: 'でんでん',
        logo: 'でんでんロゴ.png',
        right_top: '山賊カレー_切り抜き.png',
        left_bottom: '山賊焼き丼_切り抜き.png',
        menuDisplayMode: 'compact',
        startPanelBgColor: '#000',
        startPanelTextColor: '#f5f5f5',
        firstEnvironment: {
            hdrPath: '/hdr/denden/',
            hdrFile: 'denden_2.1_small.hdr',
            defaultModel: {
                name: '2種の鶏唐コンビ丼（特盛）',
                path: '/models/denden/chicken_combo_large_comp.glb',
                detail: '2種類の鶏唐揚げが通常盛りの倍の量で楽しめます！。',
                price: '税込み:1250',
            },
            modelDisplaySettings: {
                scale: 1,
                scaleARjs: 7,
                scaleAlvaAR: 30,
                scale8thWallAR: 30,
                scaleWebXR: 0.7,
                scale3DViewer: 1,
                detailPosition: [0, 0.22, -0.24],
                detailCenter: [0, 0.08],
            },
            cameraPosition: [0, 0.77, 0.49],
            controlsTarget: [0, 0.1, 0],
            lightSettings: {
                ambientLightIntensity: 0.8,
                directionalLightIntensity: 0.5,
                toneMappingExposure: 0.8,
            },
        }
    },
    {
        id: 3,
        use_name: 'theSourceDiner',
        true_name: 'The Source Diner',
        logo: 'thesource_circle.png',
        right_top: 'ラムダンプリング_切り抜き.png',
        left_bottom: 'チーズバーガー_切り抜き.png',
        menuDisplayMode: 'standard',
        startPanelBgColor: '#fff',
        startPanelTextColor: '#111',
        firstEnvironment: {
            hdrPath: '/hdr/theSourceDiner/',
            hdrFile: 'theSourceDiner_3_small.hdr',
            defaultModel: {
                name: 'チーズバーガー',
                path: '/models/theSourceDiner/burger_cheese_joint_std_video_comp5.glb',
                detail: 'とろけるチーズとジューシーなパティの王道チーズバーガー。シンプルながらも素材の美味しさが引き立つ、店主こだわりの一品です。',
                price: '1,870',
            },
            modelDisplaySettings: {
                scale: 1,
                scaleARjs: 9,
                scaleAlvaAR: 30,
                scale8thWallAR: 30,
                scaleWebXR: 0.9,
                scale3DViewer: 1,
                detailPosition: [0, 0.1, -0.3],
                detailCenter: [0, 0.08],
            },
            cameraPosition: [0.25, 0.21, 0.26],
            controlsTarget: [0, 0.05, 0],
            lightSettings: {
                ambientLightIntensity: 1,
                directionalLightIntensity: 1,
                toneMappingExposure: 0.8,
            },
        }
    },
];

export default storeInfo;

export function findStoreBySlug(slug: string) {
    return storeInfo.find((s) => s.use_name === slug) ?? null;
}