import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';

export function catchPathname(): string{
    const pathname = usePathname();
    return pathname.replace(/^\/+|\/+$/g, "");
};

// locale を除いた親パスから店舗名を取得
export function catchParentPathName(): string {
    const pathname = usePathname();
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    // segments[0] が locale の場合はスキップ
    const startIndex = locales.includes(segments[0] as Locale) ? 1 : 0;
    return segments[startIndex] || "";
}

// locale を除いた店舗名を取得
export function catchStoreName(): string {
    const pathname = usePathname();
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    // segments[0] が locale の場合はスキップ
    const startIndex = locales.includes(segments[0] as Locale) ? 1 : 0;
    return segments[startIndex] || "";
}

// 現在の locale を取得
export function catchLocale(): Locale {
    const pathname = usePathname();
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    return locales.includes(segments[0] as Locale) ? segments[0] as Locale : 'ja';
}
