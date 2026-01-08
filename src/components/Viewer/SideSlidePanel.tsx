import styled from "styled-components";
import { MyContent } from "@/components/Menu/MenuContent";
import { MyCompactContent } from "@/components/Menu/CompactMenuContent";
import type { ProductModelsProps, MenuDisplayMode } from "@/data/types";

type SideSlidePanelProps = {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    productModels: ProductModelsProps;
    jaCategories: string[];
    translatedCategories: string[];
    menuDisplayMode?: MenuDisplayMode;
};

export default function SideSlidePanel({ menuOpen, setMenuOpen, productModels, jaCategories, translatedCategories, menuDisplayMode = 'standard' }: SideSlidePanelProps) {
    return(
        <MySideSlide>
            {/* Overlay */}
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

            {/* Side Slide Bar */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                {menuDisplayMode === 'compact' ? (
                    <MyCompactContent nowCategoryIndex={0} models={productModels} jaCategories={jaCategories} translatedCategories={translatedCategories} viewer={true} />
                ) : (
                    <MyContent nowCategoryIndex={0} models={productModels} jaCategories={jaCategories} translatedCategories={translatedCategories} viewer={true} />
                )}
            </div>
        </MySideSlide>
    )
};

const MySideSlide = styled.div`
    /* Side Menu Overlay */
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 100; /* Below side-menu, above everything else */
    }

    /* Side Menu */
    .side-menu {
        position: fixed;
        top: 0;
        right: 0;
        width: 80%;
        height: 100%;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        z-index: 101; /* Ensure it's above other top layers */
        padding-top: 15px; /* Add padding to avoid being obscured by top-app-bar */
    }

    .side-menu.open {
        transform: translateX(0);
    }
`