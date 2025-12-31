import { usePathname } from 'next/navigation';

export function catchPathname(): string{
    const pathname = usePathname();
    return pathname.replace(/^\/+|\/+$/g, "");
};

export function catchParentPathName(): string{
    const pathname = usePathname();
    const current = pathname.replace(/^\/+|\/+$/g, "");
    const parent = current.split("/").slice(0, -1).join("/") || "/";
    return parent;
}

// パスから店舗名（最初のセグメント）を取得
export function catchStoreName(): string {
    const pathname = usePathname();
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    return segments[0] || "";
}
