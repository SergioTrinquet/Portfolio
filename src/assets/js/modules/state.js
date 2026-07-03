export const config = {
    deg_inclinaison_asc: "-8",
    inclinaison_desc: 8, // parsed from parseInt("-8") * -1
    intitulesMenu: ["Intro", "Qui je suis", "Compétences", "Projets perso", "Mon CV", "Fin"],
    prefixNomLabelProjets: "step_3",
};

export const state = {
    tl: null,
    ratio: null,
    dataLabelsExceptProjects: [],
    mm: null,
    flagAnimationIntro: false,
    tweenScrollToLabelOnComplete: true,
    scrolltriggerOnUpdate: {
        progress: null,
        direction: 1
    },
    menuOrArrowClicked: false,
};

export const device = {
    isMobileOrTablette: false,
    isIPadOrIPhone: false,
    isAndroid: false,
};

// Caching DOM elements
export const dom = {
    body: null,
    texteQuiSuisJeClassList: null,
    texteScrollDownClassList: null,
    menu: null,
    smallMenu: null,
    smallMenuSections: null,
    progressBar: null,
    pupilles: null,
    eyesMovingZone: null,
    intituleJob: null,
};

// Cache initial DOM elements
export function initDOM() {
    dom.body = document.querySelector("body");
    dom.texteQuiSuisJeClassList = document.querySelector(".text-qui-suis-je")?.classList;
    dom.texteScrollDownClassList = document.querySelector(".text-scroll-down")?.classList;
    dom.menu = document.querySelector(".menu");
    dom.smallMenu = document.querySelector("#menu-small-screen");
    dom.smallMenuSections = dom.smallMenu?.querySelector("#sections-list");
    dom.progressBar = document.querySelector("#progress-bar");
    dom.pupilles = document.querySelectorAll(".pupille");
    dom.eyesMovingZone = document.querySelector("#eyes-moving-zone");
    dom.intituleJob = document.querySelector("#intitule-job");
}
