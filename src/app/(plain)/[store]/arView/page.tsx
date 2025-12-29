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
import { productModels, productCategory } from '@/data/denden/MenuInfo';
import ThreeMain from '@/features/WebXR/ThreeMain';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

export default function ARViewPage() {
    const router = useRouter();
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
            router.push(xr === 'supported' ? '/denden/arView' : '/denden/arJS');
            if (xr === 'supported') {setStart(true)}
        } else {
            router.push('/denden/viewer');
            alert('デスクトップではAR表示はできません。スマートフォンにて起動をお願いします。')
        }
    }, [router]);

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
        :(<ARStartPanel onUpdate={handleStart} loading={loading} />)}
        {start &&
            <ModelChangeContext.Provider value={{ changeModel }}>
                <ThreeMain setChangeModel={setChangeModel} startAR={start} onSessionEnd={handleSessionEnd} onSessionReset={handleSessionReset}/>
                <MenuContainer productCategory={productCategory} productModels={productModels} />
            </ModelChangeContext.Provider>
        }
        </>
    );
}
