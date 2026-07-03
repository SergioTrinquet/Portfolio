import { dom, state, config, device } from './state.js';
import { getScrollTop, postIntroduction } from './intro.js';

export function getRatio() {
    const maxScroll = ScrollTrigger.maxScroll(window);
    const totalDuration = state.tl.totalDuration();
    return maxScroll / totalDuration;
}

export function setNavigation() {         
    if (state.ratio == null) state.ratio = getRatio();
    
    let menuTag = null;
    let force = false;
    
    const mm = getMedia();
    
    if (mm === "xs" || mm === "s" || window.matchMedia("only screen and (hover: none) and (pointer: coarse)").matches) { 
        force = !force;
        menuTag = dom.smallMenuSections;
    } else {
        menuTag = dom.menu;
    }
    
    dom.smallMenu.classList.toggle("display", force);
    dom.menu.classList.toggle("display", !force);

    generateMenu(menuTag, force);
}

export function generateMenu(m, isMenuSmall) {
    if (!m) return;
    let flag = false;

    m.innerHTML = "";
    state.dataLabelsExceptProjects = [];

    for (const [key, value] of Object.entries(state.tl.labels)) {
        if (key.startsWith(config.prefixNomLabelProjets) && flag === false || !(key.startsWith(config.prefixNomLabelProjets))) {
            state.dataLabelsExceptProjects.push({ k: key, v: value });
            
            m.innerHTML += `<div class='link' data-timeline='_${value}'>
                <span>${key.substring(key.indexOf("|") + 1, key.length)}</span>
            </div>`;
        }
        if (key.startsWith(config.prefixNomLabelProjets) && flag === false) flag = true;
    }

    m.querySelectorAll(".link").forEach(l => {
        l.addEventListener("click", () => {
            state.menuOrArrowClicked = true;
            gsap.to(window, { 
                duration: 6, 
                scrollTo: (state.ratio * parseFloat(l.dataset.timeline.substring(1))), 
                ease: "slow",
                onComplete: () => { state.menuOrArrowClicked = false; }
            });
            if (isMenuSmall) displaySmallMenu();
        });
    });
}

export function displaySmallMenu() {
    dom.smallMenu.querySelector(".overlay").classList.toggle("display");
    dom.smallMenuSections.classList.toggle("open");
}

export function setSelectedMenu() {
    if (!state.dataLabelsExceptProjects || state.dataLabelsExceptProjects.length === 0) return;
    const margeErreurEnPx = 30;
    for (const d of state.dataLabelsExceptProjects) {
        const actualTime = (getScrollTop() / getRatio());
        const differenceTime = actualTime - d.v;
        const link = document.querySelector(`.link[data-timeline='_${d.v}']`);
        if (link) {
            link.classList.toggle("selected", (differenceTime < margeErreurEnPx && differenceTime > (margeErreurEnPx * -1)));
        }
    }
}

export function getMedia() {
    if (window.matchMedia("(min-width: 1025px)").matches) {
        return "xl";
    } else if (window.matchMedia("(min-width: 769px)").matches) {
        return "l";
    } else if (window.matchMedia("(min-width: 481px)").matches) {
        return "m";
    } else if (window.matchMedia("(min-width: 381px)").matches) {
        return "s";
    } else {
        return "xs";
    }
}

let nbExecScrollEvent = -1;
let isScrolling = null;

export function triggerGoToLabel() {
    if (
        state.tweenScrollToLabelOnComplete === true && 
        nbExecScrollEvent === 0 && 
        state.menuOrArrowClicked === false
    ) goToLabel();

    nbExecScrollEvent++;   
    
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        nbExecScrollEvent = 0;
        console.log('Scrolling has stopped.');
    }, 66);
}

export function goToLabel() {
    const direction = state.scrolltriggerOnUpdate.direction;
    const totalDuration = state.tl.totalDuration();
    let instantDuration = totalDuration * state.scrolltriggerOnUpdate.progress;
    const marge = 50;
    instantDuration = (direction === 1) ? instantDuration += marge : instantDuration -= marge;

    const nbProjectCards = document.querySelectorAll("#projects .project-card").length;
    const dureeEntreLabelsProjets = device.isAndroid ? 1.2 : 0.6;
    const arrayDureeEntreLabelsProjets = new Array(nbProjectCards - 1).fill(dureeEntreLabelsProjets);
    const dureeEntreLabels = [1.7, 2.6, 2.7, ...arrayDureeEntreLabelsProjets, 5, 1.5];

    let durationBetweenLabels = null, i = 0;
    let nomLabelBefore = null, nomLabelAfter = null;
    for (const [key, value] of Object.entries(state.tl.labels)) {
        if (instantDuration > value) {
            durationBetweenLabels = dureeEntreLabels[i];
            nomLabelBefore = key;
        }
        if (instantDuration < value) {
            durationBetweenLabels = dureeEntreLabels[i - 1];
            nomLabelAfter = key;
            break;
        }
        i++;
    }
    
    const nomLabelToGo = (direction === 1) ? nomLabelAfter : nomLabelBefore;
    if (!nomLabelToGo) return;
    
    state.tweenScrollToLabelOnComplete = false;
    gsap.to(window, {
        duration: durationBetweenLabels, 
        scrollTo: { y: state.tl.scrollTrigger.labelToScroll(nomLabelToGo), autokill: false },
        ease: "slow",
        onComplete: () => { 
            state.tweenScrollToLabelOnComplete = true; 
            console.log("Tween finished !!");
        }
    });             
}

export function initNavigationEvents() {
    // Menu mobile click listeners
    dom.smallMenu.querySelector(".icon-menu")?.addEventListener("click", displaySmallMenu);
    dom.smallMenu.querySelector(".overlay")?.addEventListener("click", displaySmallMenu);

    // Scroll listener
    window.addEventListener('scroll', () => {
        triggerGoToLabel();
        postIntroduction();
    }, false);

    // Back to top link
    document.querySelector("#link-back-to-top")?.addEventListener("click", () => {
        state.tl.progress(0);
        document.documentElement.scrollTop = dom.body.scrollTop = 0;
        setSelectedMenu();
    });
}
