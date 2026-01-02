import styled from "styled-components"

type Props = {
    isVisible: boolean;
}

export default function GuideQRCode({ isVisible }: Props) {
    return(
        // <!-- ガイド用インジケーター -->
        <MyGuideQR>
            <div id="guideMarker" className={`guide-overlay ${isVisible ? 'visible' : ''}`}>
                {/* 台形の穴を持つSVGオーバーレイ */}
                <svg className="guide-mask" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <defs>
                        <mask id="trapezoidHole">
                            <rect width="100" height="100" fill="white"/>
                            {/* 台形の穴（上辺を小さく） */}
                            <polygon points="30,29 70,29 76,50 24,50" fill="black"/>
                        </mask>
                    </defs>
                    <rect width="100" height="100" fill="rgba(0,0,0,0.55)" mask="url(#trapezoidHole)"/>
                </svg>
                <div className="guide-frame"></div>
                <div className="guide-text">
                    QRコードの周りにある黒い縁を<br />
                    上の枠に合わせてください
                </div>
                <div className="guide-text">
                    商品の表示を開始します！
                </div>
            </div>
        </MyGuideQR>
    )
}

const MyGuideQR = styled.div`
/* ガイド用インジケーター */
.guide-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.guide-overlay.visible {
    opacity: 1;
    pointer-events: all;
}

/* SVGマスク（全画面を覆う） */
.guide-mask {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

/* 台形の枠線を表示 */
.guide-frame {
    position: absolute;
    width: 220px;
    height: 152px;
    top: calc(40% - 80px);
    left: 50%;
    transform: translateX(-50%);
    /* 台形の枠線 */
    clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
    border: 3px solid rgba(255, 255, 255, 0.7);
    box-sizing: border-box;
    pointer-events: none;
}

/* テキストは穴の下に */
.guide-text {
    position: absolute;
    top: calc(40% + 130px);
    color: #fff;
    font-size: 22px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.guide-text:last-of-type {
    top: calc(40% + 200px);
}

`