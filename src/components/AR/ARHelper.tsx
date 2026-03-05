'use client';

import styled from "styled-components"
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { HiOutlineMenu, HiX } from "react-icons/hi";

interface ARHelperProps {
    onExit: () => void;
    onClear?: () => void;
    onReset?: () => void;
    showClearObjects: boolean;
    showResetHit: boolean;
    groupActions?: boolean;
}

export default function ARHelper({ onExit, onClear, onReset, showClearObjects, showResetHit, groupActions }: ARHelperProps) {
    const t = useTranslations('arHelper');
    const [expanded, setExpanded] = useState(false);

    return(
        // <!-- AR中のUI -->
        <MyHelper>
            <div id="ar-ui" className="ar-ui">
                <div>{t('arModeActive')}</div>
                <div>{t('selectProduct')}</div>
            </div>

            <button id="exit-button" className="send-viewer-button" onClick={onExit}>{t('backToViewer')}</button>

            {groupActions ? (
                <div id="group-actions" className="group-actions" style={{ display: 'none' }}>
                    <button
                        className={`group-toggle-button${expanded ? ' expanded' : ''}`}
                        onClick={() => setExpanded(v => !v)}
                    >
                        {expanded ? <HiX size={22} /> : <HiOutlineMenu size={22} />}
                    </button>
                    {expanded && (
                        <div className="group-panel">
                            {showClearObjects && (
                                <div className="group-action-item">
                                    <button className="clear-button" onClick={() => { onClear?.(); setExpanded(false); }}>♻️</button>
                                    <div className="clear-text">{t('clearModel')}</div>
                                </div>
                            )}
                            {showResetHit && (
                                <div className="group-action-item">
                                    <button className="reset-button" onClick={() => { onReset?.(); setExpanded(false); }}>🔎</button>
                                    <div className="reset-text">{t('resetPlane')}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {showClearObjects && (
                        <div id="clear-objects" className="clear-objects">
                            <button id="clear-button" className="clear-button" onClick={onClear}>♻️</button>
                            <div id="clear-text" className="clear-text">{t('clearModel')}</div>
                        </div>
                    )}
                    {showResetHit && (
                        <div id="reset-hit" className="reset-hit">
                            <button id="reset-button" className="reset-button" onClick={onReset}>🔎</button>
                            <div id="reset-text" className="reset-text">{t('resetPlane')}</div>
                        </div>
                    )}
                </>
            )}
        </MyHelper>
    );
}

const MyHelper = styled.div`
.ar-ui {
    position: absolute;
    top: 40px;
    left: 20px;
    width: auto;
    color: white;
    background: rgba(0,0,0,0.7);
    padding: 15px;
    border-radius: 10px;
    font-size: 14px;
    display: none;
    z-index: 100;
}

.exit-button {
    position: absolute;
    top: 40px;
    right: 25px;
    background: rgba(244, 67, 54, 0.8);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: none;
    z-index: 100;
}

.send-viewer-button {
    position: absolute;
    top: 40px;
    right: 25px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(30, 136, 229, 0.95));
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: none;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.send-viewer-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(33, 150, 243, 0.5);
    background: linear-gradient(135deg, rgba(30, 136, 229, 0.95), rgba(25, 118, 210, 1));
}
.send-viewer-button:active {
    transform: translateY(0) scale(0.97);
    box-shadow: 0 3px 8px rgba(33, 150, 243, 0.3);
}
.send-viewer-button:focus {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 3px;
}

.clear-objects {
    position: absolute;
    top: 100px;
    right: 22px;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.clear-button {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: none;
    color: #fff;
    font-size: 26px;
    line-height: 1;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 100;
}
.clear-button:hover {
    transform: translateY(-2px) rotate(-15deg);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
    background: none;
}
.clear-button:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}
.clear-button:focus {
    outline: 2px solid rgba(255,255,255,0.6);
    outline-offset: 3px;
}
.clear-text {
    color: white;
    font-size: 14px;
    text-align: center;
    z-index: 100;
}

.reset-hit {
    position: absolute;
    top: 180px;
    right: 22px;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.reset-button {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: none;
    color: #fff;
    font-size: 26px;
    line-height: 1;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 100;
}
.reset-button:hover {
    transform: translateY(-2px) rotate(-15deg);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
    background: none;
}
.reset-button:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}
.reset-button:focus {
    outline: 2px solid rgba(255,255,255,0.6);
    outline-offset: 3px;
}
.reset-text {
    color: white;
    font-size: 14px;
    text-align: center;
    z-index: 100;
}

.group-actions {
    position: absolute;
    top: 110px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    z-index: 100;
}

.group-toggle-button {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.group-toggle-button.expanded {
    background: rgba(80, 80, 80, 0.75);
}
.group-toggle-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}
.group-toggle-button:active {
    transform: scale(0.95);
}

.group-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    animation: slideDown 0.18s ease;
}
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}

.group-action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
`