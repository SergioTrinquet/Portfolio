// import '../css/styles.css';
import { initDOM } from './modules/state.js';
import { detectDevice, initCSSUnits } from './modules/device.js';
import { loadSVGfiles } from './modules/loader.js';
import { createModalPortraitIsBetter } from './modules/modal.js';
import { initJobTitleAnimation, initEyeballTracking } from './modules/microInteractions.js';
import { introduction } from './modules/intro.js';
import { initScrollTriggerTimeline } from './modules/timeline.js';
import { initNavigationEvents } from './modules/navigation.js';

(async function () {
    // 1. Initialiser le cache DOM et détecter l'appareil
    initDOM();
    detectDevice();
    initCSSUnits();

    // 2. Charger les SVG externalisés
    await loadSVGfiles();

    // 3. Lancer les modals d'avertissement
    createModalPortraitIsBetter("st_dont-show-modal");

    // 4. Initialiser la timeline ScrollTrigger
    initScrollTriggerTimeline();

    // 5. Configurer la navigation générale (boutons retour, scroll, mobile)
    initNavigationEvents();

    // 6. Activer les micro-interactions (titre job circulaire et yeux suiveurs)
    initJobTitleAnimation();
    initEyeballTracking();

    // 7. Lancer la cinématique d'introduction
    introduction();
})();