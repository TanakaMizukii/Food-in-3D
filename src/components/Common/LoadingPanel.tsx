import styled from "styled-components"

type Props = {
    isVisible?: boolean;
    text?: string;
    progress?: number;
}

export default function LoadingPanel({ isVisible, text = 'モデルを読み込み中...', progress }: Props) {
    return(
        // <!-- ローディングインジケーター -->
        <MyLoading>
            <div id="loading" className={`loading-overlay ${isVisible ? 'visible' : ''}`}>
                <div className="loading-spinner"></div>
                <div className="loading-text">{text}</div>
                {progress !== undefined && (
                    <>
                        <div className="loading-progress-container">
                            <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="loading-progress-text">{progress}%</div>
                    </>
                )}
            </div>
        </MyLoading>
    )
}

const MyLoading = styled.div`
/* ローディングインジケーター */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.loading-overlay.visible {
    opacity: 1;
    pointer-events: all;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 3s linear infinite;
    margin-bottom: 30px;
}

.loading-text {
    color: white;
    font-size:22px;
    text-align: center;
    white-space: pre-line;
}

.loading-progress-container {
    width: 200px;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    margin-top: 16px;
    overflow: hidden;
}

.loading-progress-bar {
    height: 100%;
    background-color: #3498db;
    border-radius: 3px;
    transition: width 0.2s ease;
}

.loading-progress-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-top: 6px;
}
`
