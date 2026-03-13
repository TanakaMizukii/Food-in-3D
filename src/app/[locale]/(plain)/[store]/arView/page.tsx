'use client';

import { useCallback, useState, useMemo, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import MenuContainer from '@/components/Menu/MenuContainer';
import CompactMenuContainer from '@/components/Menu/CompactMenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import '../App.css';
import ARStartPanel from "@/components/StartPanel/ARStartPanel";
import ARResetPanel from "@/components/AR/ARResetPanel";
import ThreeMain from '@/features/WebXR/ThreeMain';
import { catchParentPathName, catchLocale } from '@/lib/catchPathname';
import { getLocalizedStoreMenu, getLocalizedStoreInfo } from '@/data/storeMenus';
import { findStoreBySlug } from '@/data/storeInfo';
import { useTranslations } from 'next-intl';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

function ARViewPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nowStore = catchParentPathName();
    const locale = catchLocale();
    const storeMenu = getLocalizedStoreMenu(nowStore, locale);
    const storeInfo = findStoreBySlug(nowStore);
    const baseLocalizedStoreInfo = getLocalizedStoreInfo(storeInfo, storeMenu, locale);
    const menuDisplayMode = storeInfo?.menuDisplayMode ?? 'standard';
    const t = useTranslations('ar');

    // URLパラメータからの初期モデル解決
    const modelIdParam = searchParams.get('model');
    const initialProduct = modelIdParam
        ? storeMenu.productModels.find(p => p.id === Number(modelIdParam))
        : undefined;

    // useMemoでオブジェクト参照を安定化（毎レンダーで新規オブジェクトになると無限ループになる）
    const localizedStoreInfo = useMemo((): typeof baseLocalizedStoreInfo => {
        if (!modelIdParam || !baseLocalizedStoreInfo?.firstEnvironment) return baseLocalizedStoreInfo;
        const id = Number(modelIdParam);
        const product = storeMenu.productModels.find(p => p.id === id);
        if (!product) return baseLocalizedStoreInfo;
        return {
            ...baseLocalizedStoreInfo,
            firstEnvironment: {
                ...baseLocalizedStoreInfo.firstEnvironment!,
                defaultModel: {
                    name: product.name,
                    path: product.model,
                    detail: product.description,
                    price: product.price,
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelIdParam]);

    const defaultModelId = storeMenu.productModels.find(
        p => p.name === baseLocalizedStoreInfo?.firstEnvironment?.defaultModel?.name
    )?.id;
    const [currentModelId, setCurrentModelId] = useState<number | undefined>(
        initialProduct?.id ?? defaultModelId
    );
    const currentModelIdRef = useRef(currentModelId);
    useEffect(() => {
        currentModelIdRef.current = currentModelId;
    }, [currentModelId]);

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
        const modelParamStr = modelIdParam ? `?model=${modelIdParam}` : '';

        if (os === 'android' || os === 'ios') {
            router.push(xr === 'supported' ? `/${locale}/${nowStore}/arView${modelParamStr}` : `/${locale}/${nowStore}/arJS${modelParamStr}`);
            if (xr === 'supported') {setStart(true)}
        } else {
            router.push(`/${locale}/${nowStore}/viewer`);
            alert(t('desktopAlert'));
        }
    }, [router, nowStore, locale, t, modelIdParam]);

    const handleSessionEnd = () => {
        setStart(false);
        setShowARResetPanel(false);
        setLoading(false);
        const modelParam = currentModelIdRef.current !== undefined ? `?model=${currentModelIdRef.current}` : '';
        router.push(`/${locale}/${nowStore}/viewer${modelParam}`);
    };

    const handleSessionReset = () => {
        setStart(false);
        setShowARResetPanel(true);
        setLoading(false);
    };

    // モデル変更時にcurrentModelIdを追跡するラッパー
    const trackedChangeModel: ChangeModelFn = useCallback(async (info) => {
        if (info.modelName) {
            const found = storeMenu.productModels.find(p => p.name === info.modelName);
            if (found) setCurrentModelId(found.id);
        }
        await changeModel(info);
    }, [changeModel, storeMenu.productModels]);

    return (
        <>
        {showARResetPanel
        ?(<ARResetPanel onRestart={handleStart}/>)
        :(<ARStartPanel onUpdate={handleStart} loading={loading} store={nowStore} />)}
        {start &&
            <ModelChangeContext.Provider value={{ changeModel: trackedChangeModel }}>
                <ThreeMain setChangeModel={setChangeModel} startAR={start} onSessionEnd={handleSessionEnd} onSessionReset={handleSessionReset} storeInfo={localizedStoreInfo} />
                {menuDisplayMode === 'compact' ? (
                    <CompactMenuContainer productCategory={storeMenu.productCategory} jaCategories={storeMenu.jaProductCategory} productModels={storeMenu.productModels} />
                ) : (
                    <MenuContainer productCategory={storeMenu.productCategory} jaCategories={storeMenu.jaProductCategory} productModels={storeMenu.productModels} />
                )}
            </ModelChangeContext.Provider>
        }
        </>
    );
}

export default function ARViewPage() {
    return (
        <Suspense>
            <ARViewPageInner />
        </Suspense>
    );
}
