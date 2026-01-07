'use client';
import styled from "styled-components";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineGlobe } from "react-icons/hi";
import { locales, type Locale } from "@/i18n/routing";

const languages: { code: Locale; label: string }[] = [
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
];

export default function LanguageSelector() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // 現在のlocaleを取得
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    const currentLocale = locales.includes(segments[0] as Locale) ? segments[0] as Locale : 'ja';

    const handleLanguageChange = (newLocale: Locale) => {
        // 現在のパスからlocaleを置き換え
        const newPathname = '/' + newLocale + '/' + segments.slice(1).join('/');
        router.push(newPathname);
        setIsOpen(false);
    };

    const currentLanguage = languages.find(l => l.code === currentLocale);

    return (
        <SelectorContainer>
            <SelectorButton onClick={() => setIsOpen(!isOpen)}>
                <HiOutlineGlobe />
                <span>{currentLanguage?.code}</span>
            </SelectorButton>
            {isOpen && (
                <Dropdown>
                    {languages.map((lang) => (
                        <DropdownItem
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            $isActive={lang.code === currentLocale}
                        >
                            {lang.label}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </SelectorContainer>
    );
}

const SelectorContainer = styled.div`
    position: relative;
`;

const SelectorButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 8px 12px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
    z-index: 100;
    min-width: 120px;
`;

const DropdownItem = styled.button<{ $isActive: boolean }>`
    display: block;
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    border: none;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;
