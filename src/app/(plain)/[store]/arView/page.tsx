'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import MenuContainer from '@/components/MenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import '../App.css';
import ARStartPanel from "@/components/ARStartPanel";
import ARResetPanel from "@/components/ARResetPanel";
import ThreeMain from '@/features/WebXR/ThreeMain';
import { catchParentPathName } from '@/lib/catchPathname';
import { getStoreMenu } from '@/data/storeMenus';
import { findStoreBySlug } from '@/data/storeInfo';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function ARViewPage() {
    const router = useRouter();
    const nowStore = catchParentPathName();
    const storeMenu = getStoreMenu(nowStore);
    const storeInfo = findStoreBySlug(nowStore);

    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState(false);
    const [showARResetPanel, setShowARResetPanel] = useState(false);
    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });

    const handleStart = useCallback(async() => {
        setLoading(true);
        const os = getMobileOS();
        const xr = await checkImmersiveARSupport();

        if (os === 'android' || os === 'ios') {
            router.push(xr === 'supported' ? `/${nowStore}/arView` : `/${nowStore}/arJS`);
            if (xr === 'supported') {setStart(true)}
        } else {
            router.push(`/${nowStore}/viewer`);
            alert('デスクトップではAR表示はできません。スマートフォンにて起動をお願いします。')
        }
    }, [router, nowStore]);

    const handleSessionEnd = () => {
        setStart(false);
        setShowARResetPanel(false);
        setLoading(false);
    };

    const handleSessionReset = () => {
        setStart(false);
        setShowARResetPanel(true);
        setLoading(false);
    }

    return (
        <>
        {showARResetPanel
        ?(<ARResetPanel onRestart={handleStart}/>)
        :(<ARStartPanel onUpdate={handleStart} loading={loading} store={nowStore} />)}
        {start &&
            <ModelChangeContext.Provider value={{ changeModel }}>
                <ThreeMain setChangeModel={setChangeModel} startAR={start} onSessionEnd={handleSessionEnd} onSessionReset={handleSessionReset} storeInfo={storeInfo} />
                <MenuContainer productCategory={storeMenu.productCategory} productModels={storeMenu.productModels} />
            </ModelChangeContext.Provider>
        }
        </>
    );
}
