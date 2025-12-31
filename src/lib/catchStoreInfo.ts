import { usePathname } from 'next/navigation';
import storeNames from '@/data/storeInfo';

import type { StoreNames } from '@/data/types';

export function catchStorename(): string{
    const pathname = usePathname()
    return pathname.replace(/^\/+|\/+$/g, "");
}

export function catchPathStoreInfo(store: string): StoreNames | null{
    const pathStoreInfo = storeNames.find((s) => {
        return s.use_name === store;
    }) ?? null;
    return pathStoreInfo;
}