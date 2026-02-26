'use client';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import { useTranslations } from 'next-intl';
import { HiMagnifyingGlass } from "react-icons/hi2";

type PrimaryFabProps = {
    onOpenDetail: () => void;
    peekHeight?: number;
};

export default function PrimaryFab({ onOpenDetail, peekHeight = 0 }: PrimaryFabProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const t = useTranslations('ar');

    useEffect(() => {
        if (getMobileOS() === 'ios') {
            setIsIOS(true);
        }
    }, []);

    const handleARStart = async () => {
        setIsLoading(true);
        const os = getMobileOS();
        const xr = await checkImmersiveARSupport();

        // 末尾 / を消してから親を計算
        const current = pathname.replace(/\/$/, "");
        const parent = current.split("/").slice(0, -1).join("/") || "/";

        // ★ "/" のときだけ空にして、 "//xxx" を防ぐ
        const base = parent === "/" ? "" : parent;

        if (os === "android" || os === "ios") {
            router.push(xr === "supported" ? `${base}/arView` : `${base}/arJS`);
        } else {
            router.push(`${base}/viewer`);
            alert(t('desktopAlert'));
        }

        setIsLoading(false);
    }

    const handleBetaStart = async () => {
        // 末尾 / を消してから親を計算
        const current = pathname.replace(/\/$/, "");
        const parent = current.split("/").slice(0, -1).join("/") || "/";

        // ★ "/" のときだけ空にして、 "//xxx" を防ぐ
        const base = parent === "/" ? "" : parent;
        router.push(`${base}/alvaAR`);
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return(
        <MyFabContainer style={{ bottom: `calc(${peekHeight}px + 40px)` }}>
            {/* Expanded content - 上に展開 */}
            <div className={`expanded-content ${isExpanded ? 'visible' : ''}`}>
                <h6 className="explanation-title">{t('title')}</h6>
                <p className="explanation-text">{t('description')}</p>
                <button className="ar-start-button" onClick={handleARStart} disabled={isLoading}>
                    {isLoading ? t('checking') : t('startButton')}
                </button>
                {isIOS && (
                    <BetaButton onClick={handleBetaStart}>
                        AR(β版)で開始
                    </BetaButton>
                )}
            </div>

            {/* ボタン行: AR FAB + 虫眼鏡 */}
            <div className="fab-row">
                <button className="primary-fab" onClick={toggleExpand}>
                    {isExpanded ? '×' : 'AR'}
                </button>
                <button className="detail-fab" onClick={onOpenDetail}>
                    <HiMagnifyingGlass />
                </button>
            </div>
        </MyFabContainer>
    )
};

const BetaButton = styled.a`
    background: linear-gradient(135deg, #ff4d4d, #cc0000);
    color: #ffffff;
    border: none;
    border-radius: 14px;
    padding: 13px 20px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.20s ease;
    width: 80%;
    box-shadow: 0 6px 18px rgba(255, 77, 77, 0.35);
    text-decoration: none;
    text-align: center;
    margin-top: 8px;

    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff5f5f, #dd1111);
        box-shadow: 0 8px 22px rgba(255, 77, 77, 0.45);
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.98);
        box-shadow: 0 6px 20px rgba(255, 77, 77, 0.35);
    }
`;

const MyFabContainer = styled.div`
    position: absolute;
    left: 50%;
    bottom: 120px;
    transform: translateX(-32px); /* AR ボタン(64px)の中心を画面 50% に合わせる */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* コンテナ自体はイベントを通過させ、OrbitControlsのピンチ操作を遮断しない。
       子要素（.primary-fab・.detail-fab・.expanded-content.visible）は各自でautoを保持する。 */
    pointer-events: none;

    @media (min-width: 1268px) {
        display: none;
    }

    /* ボタン行 */
    .fab-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 40px;
    }

    /* 虫眼鏡FAB */
    .detail-fab {
        width: 52px;
        height: 52px;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 50%;
        color: rgba(255,255,255,0.9);
        cursor: pointer;
        transition: all 0.2s;
        pointer-events: auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .detail-fab svg {
        width: 22px;
        height: 22px;
    }

    .detail-fab:hover {
        background: rgba(0,0,0,0.75);
        transform: scale(1.05);
    }

    .detail-fab:active {
        transform: scale(0.95);
    }

    /* Expanded Content - 上に展開 (AR ボタン中心に配置) */
    .expanded-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        padding: 16px;
        border-radius: 12px;
        width: 220px;
        /* AR ボタン中心(32px from left) に 220px パネルを揃える: 32 - 110 = -78px */
        margin-left: -78px;
        margin-bottom: 12px;
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        pointer-events: none;
    }

    .expanded-content.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    .explanation-title {
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }

    .explanation-text {
        color: white;
        font-size: 14px;
        text-align: left;
        margin: 0;
        margin-bottom: 12px;
    }

.ar-start-button {
    background: linear-gradient(135deg, #4ade80, #22c55e); /* 明るいライム系 */
    color: #ffffff;
    border: none;
    border-radius: 14px;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.20s ease;
    width: 100%;
    box-shadow: 0 6px 18px rgba(34, 197, 94, 0.35);
}

/* ホバー時：軽く光る → 押したくなる */
.ar-start-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #5ef08e, #31d971);
    box-shadow: 0 8px 22px rgba(34, 197, 94, 0.45);
    transform: translateY(-1px);
}

/* disabled も視認性UP */
.ar-start-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}


/* Primary FAB - 単色レッド版 */
.primary-fab {
    width: 64px;
    height: 64px;
    background: #ff4d4d;  /* 単色で一番押される赤 */
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 26px;
    font-weight: 700;
    cursor: pointer;
    pointer-events: auto; /* 親のnoneを上書きしてタップ可能にする */

    display: flex;
    align-items: center;
    justify-content: center;

    /* 押されやすいよう影は赤寄りに */
    box-shadow: 0 8px 24px rgba(255, 80, 80, 0.45);

    transition: all 0.22s ease-out;

    position: relative;
    flex-shrink: 0;
}

/* ホバー時 - 微妙に明るくして誘導 */
.primary-fab:hover:not(:disabled) {
    background: #ff5f5f;
    box-shadow: 0 10px 28px rgba(255, 80, 80, 0.55);
    transform: translateY(-2px);
}

/* クリック時 */
.primary-fab:active {
    transform: scale(0.92);
    box-shadow: 0 6px 20px rgba(255, 80, 80, 0.35);
}

/* 無効化 */
.primary-fab:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

`