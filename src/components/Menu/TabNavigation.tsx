import styled from "styled-components";

type categoryProps = {
    pdtLists: string[];
    onUpdate: (index: number) => void;
    toggleCheck: () => void;
    currentIndex: number;
};

export default function TabNavigation({pdtLists, onUpdate, toggleCheck, currentIndex} : categoryProps) {
    const handleClick = (index: number) => {
        onUpdate(index);
        toggleCheck();
    }
    return(
        <MyTab>
            <div className="tab-navigation">
                {
                pdtLists.map((elem, index) => (
                    <button key={index}
                            className={`tab-btn ${index === currentIndex ? 'active': ''}`}
                            onClick={() => handleClick(index)}
                    >
                        {elem}
                    </button>
                ))
                }
            </div>
        </MyTab>
    )
};

const MyTab = styled.div`
    .tab-navigation {
        display: flex;
        justify-content: flex-start;
        padding: 10px 15px;
        overflow-x: auto;
        white-space: nowrap;
        background-color: #f5f5f5;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        /* 追加: 固定表示 */
        position: sticky;
        top: 50px; /* menu-toggleの高さに合わせて調整 */
        z-index: 9;
        cursor: grab; /* カーソルをつかめる形状に */
    }
    .tab-navigation:active {
        cursor: grabbing; /* ドラッグ中のカーソル */
    }

    /* Chrome、Safari、Edgeのスクロールバーを非表示 */
    .tab-navigation::-webkit-scrollbar {
        display: none;
    }

    .tab-btn {
        padding: 8px 20px;
        margin-right: 10px;
        background-color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
    }
    .tab-btn.active {
        background-color: #333;
        color: #fff;
    }
`