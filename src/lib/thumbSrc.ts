import { findStoreBySlug } from "@/data/storeInfo";

export type ThumbRole = "right_top" | "logo" | "left_bottom";

export function getThumbSrc(store: string, role: ThumbRole): string | undefined {
    const storeInfo = findStoreBySlug(store);
    const pictureName = storeInfo?.[role];
    if (!pictureName) {
        return undefined;
    }
    return `/thumb/${store}/${pictureName}`;
}
