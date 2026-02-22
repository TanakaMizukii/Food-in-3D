'use client';
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";
import { getThumbSrc } from "@/lib/thumbSrc";
import { useTranslations } from 'next-intl';
import LanguageSelector from "@/components/Common/LanguageSelector";
import { useState, useEffect } from "react";
import { getMobileOS } from "@/lib/detectOS";
import { findStoreBySlug } from "@/data/storeInfo";

type StartPanelProps = {
    onUpdate: () => void;
    loading: boolean;
    store: string;
}

type OptionalImgProps = {
    src: string | undefined;
    alt: string;
    id?: string;
    className?: string;
};

export default function StoreStartPanel({ onUpdate, loading, store }: StartPanelProps) {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('startPanel');
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        if (getMobileOS() === 'ios') {
            setIsIOS(true);
        }
    }, []);
    const handleClick = () => {
        onUpdate();
    };

    const storeData = findStoreBySlug(store);
    const bgColor = storeData?.startPanelBgColor ?? '#000';
    const textColor = storeData?.startPanelTextColor ?? '#f5f5f5';

    const thumbSrc = (role: "right_top" | "logo" | "left_bottom") => getThumbSrc(store, role);

    function OptionalImg({ src, alt, id, className }: OptionalImgProps) {
        if (!src) return null;
        return <img src={src} alt={alt} id={id} className={className} />;
    }

    const handleBetaStart = async () => {
        // 末尾 / を消してから現在のパスを計算
        const current = pathname.replace(/\/$/, "");
        // ★ "/" のときだけ空にして、 "//xxx" を防ぐ
        const base = current === "/" ? "" : current;
        router.push(`${base}/alvaAR`);
    }

    return(
        // <!-- 店舗スタートパネル -->
        <MyStart $bgColor={bgColor} $textColor={textColor}>
            <div id="start-overlay" className={'startOverlay'}>
                <div className="languageSelectorWrapper">
                    <LanguageSelector />
                </div>
                <OptionalImg
                    src={thumbSrc("right_top")}
                    alt="右上商品イメージ"
                    id="start-right-up"
                    className="startSideImg rightTopImg"
                />
                <OptionalImg
                    src={thumbSrc("logo")}
                    alt="メインイメージ"
                    id="start-image"
                    className="startImage"
                />
                <OptionalImg
                    src={thumbSrc("left_bottom")}
                    alt="左下商品イメージ"
                    id="start-left-bottom"
                    className="startSideImg leftBottomImg"
                />
                <div id="status-text" className={'startText'}>
                    {t('message').split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </div>
                    <button id="start-button" className={'startButton'} onClick={handleClick} disabled={loading}>
                        {loading ? t('loading') : t('startButton')}
                    </button>
                    {/* {isIOS && (
                        <BetaButton onClick={handleBetaStart}>
                            β版で開始
                        </BetaButton>
                    )} */}
                <div id="loading-spinner" className={'loadingSpinner'} style={{ display: loading ? 'block' : 'none' }} />
            </div>
        </MyStart>
    )
}

const BetaButton = styled.button`
    background: linear-gradient(145deg, rgba(34,178,34,0.5), rgba(0,128,0,0.5));
    color: white;
    padding: 18px 45px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
    border: 1px solid #22b222;
    cursor: pointer;
    min-width: 200px;
    text-align: center;
    transition: all 0.2s ease-out;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    text-decoration: none;
    display: inline-block;
    margin-top: 15px;
    z-index: 1000;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 28px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.3);
        background: linear-gradient(145deg, rgba(50, 205, 50, 0.7), rgba(0, 100, 0, 0.7));
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 5px 15px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
    }
`;

const MyStart = styled.div<{ $bgColor: string; $textColor: string }>`
.startOverlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.5s ease;
    background: ${({ $bgColor }) => $bgColor};
    padding: 20px;
    box-sizing: border-box;
}

.startImage {
    width: 150px;
    height: auto;
    margin-bottom: 25px;
    border-radius: 12px; /* 円形ではなく角丸に */
    object-fit: cover;
    -webkit-user-drag: none;
    user-select: none;
}

.startSideImg {
    width: 100vw; /* Increased width */
    height: auto;
    animation: fadeIn 1.2s ease-out forwards;
    opacity: 0;
    -webkit-user-drag: none;
    user-select: none;
}

.rightTopImg {
    position: absolute;
    top: -20vw;
    right: -60vw;
    transform: rotate(15deg);
    animation-delay: 0.3s;
}

.leftBottomImg {
    position: absolute;
    bottom: -20vw;
    left: -50vw;
    transform: rotate(-15deg);
    animation-delay: 0.6s;
}

@media (min-width: 768px) {
    .startSideImg {
        max-width: 500px;
    }

    .rightTopImg {
        top: -5vw;
        right: -10vw;
    }

    .leftBottomImg {
        bottom: -5vw;
        left: -10vw;
    }
}

.startText {
    color: ${({ $textColor }) => $textColor};
    font-size: 20px;
    font-family: "Garamond", "Times New Roman", serif;
    margin-bottom: 30px;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
}

.startButton {
    background: linear-gradient(145deg, #b22222, #800000);
    color: white;
    padding: 18px 45px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
    border: 1px solid #b22222;
    cursor: pointer;
    min-width: 280px;
    text-align: center;
    transition: all 0.2s ease-out;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    z-index: 1000;
}

.startButton:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.3);
    background: linear-gradient(145deg, #c23b3b, #991111);
}

.startButton:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 5px 15px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
}

.startButton:disabled {
    background: #555;
    color: #999;
    border-color: #666;
    cursor: not-allowed;
}

.loadingSpinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(178, 34, 34, 0.2);
    border-top: 4px solid #b22222;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

.languageSelectorWrapper {
    position: absolute;
    top: 32px;
    left: 32px;
    z-index: 10;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`