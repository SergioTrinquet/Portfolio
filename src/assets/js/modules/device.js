// Détection d'appareils et correctifs

import { device } from './state.js';

export function detectDevice() {
    device.isIPadOrIPhone = detectIOS();
    device.isMobileOrTablette = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || 
                                (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)) ||
                                window.matchMedia("only screen and (hover: none) and (pointer: coarse)").matches;
    device.isAndroid = device.isMobileOrTablette && !device.isIPadOrIPhone;
}

function detectIOS() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAppleDevice = navigator.userAgent.includes('Macintosh');
    const isTouchScreen = navigator.maxTouchPoints >= 1;
    const iOS1to12quirk = () => {
        const audio = new Audio();
        audio.volume = 0.5;
        return audio.volume === 1;
    };
    return isIOS || (isAppleDevice && (isTouchScreen || iOS1to12quirk()));
}

export function initCSSUnits() {
    if (device.isMobileOrTablette) {
        const setCSSunits = () => {
            const h = window.innerHeight;
            const w = window.innerWidth;
            const max = (h - w > 0) ? h : w;
            const min = (h - w < 0) ? h : w;
            document.documentElement.style.setProperty('--vh', `${h/100}px`);
            document.documentElement.style.setProperty('--vmax', `${max/100}px`);
            document.documentElement.style.setProperty('--vmin', `${min/100}px`);
        };
        window.addEventListener('resize', setCSSunits);
        window.matchMedia("(orientation: landscape)").onchange = setCSSunits;
        setCSSunits();
    }
}
