import { dom, state, config, device } from './state.js';
import { getMedia, setNavigation, setSelectedMenu } from './navigation.js';

export function setProjectCards(intituleMenu) {
    const cards = document.querySelectorAll("#projects .project-card");
    const nbProjectCards = cards.length;
    const durationPause = 50;
    const durationTransition = 80;
    const units = 100;

    state.tl
        .to(".project-card", { duration: durationPause })
        .addLabel(`${config.prefixNomLabelProjets}_1|${intituleMenu}`, ">")
        .to(".project-card", { duration: durationPause });

    for (let i = 1; i < nbProjectCards; i++) {
        const coordY = -(i * units);
        const targets = Array.from(cards).slice(i);
        
        state.tl
            .to(targets, { "--y-coord": coordY, duration: durationTransition })
            .to(cards[i-1], { autoAlpha: 0, scale: 0.8, duration: (durationTransition / 2) }, "<")
            .to(".project-card", { duration: durationPause })
            .addLabel(`${config.prefixNomLabelProjets}_${i+1}|${intituleMenu}`, ">") 
            .to(".project-card", { duration: durationPause });
    }
    return state.tl;
}

export function generateTimeline() {
    const deg_inclinaison_asc = config.deg_inclinaison_asc;
    const inclinaison_desc = config.inclinaison_desc;
    const intitulesMenu = config.intitulesMenu;

    state.tl
        .set(`.wrapper-SVGs-and-texts, .rayons, .text-presentation, #bg-screen-1-and-2 > .ray, 
        #content-screen-3, .pre-screen-3, #content-screen-3 #shadows > div, .halo, .half-screen-bg, #skills .domain, .domain .title, #SVGs, #intitule-job, #content-screen-4, #section-titles .section-title, #skills, 
        #bg-screen-5, #SVG-chaise, #SVG-table-sans-pied-BG, #SVG-table-pied-BG, #SVG-corps, #SVG-bras,#SVG-laptop, #SVG-lampe, #SVG-tasse, #SVG-ombre, .msg-remerciements, .msg-remerciements > *, #marge-right,
        #bg-screen-end, #bg-screen-end #mot span, #bg-screen-end .mot-trait, .bg-transitional, .SVGs-and-annexes
        `, { clearProps: "all", "--y-coord": 100, "--top-half-screen-bg": 45 });
                  
    if (device.isIPadOrIPhone) {
        state.tl.set(".SVGs-and-annexes", { width: "70vmin" });
    }

    state.tl
        .addLabel(`step_1_1|${intitulesMenu[0]}`, ">")
        .to(".wrapper-SVGs-and-texts", { width: "min(70vw, 900px)", height: "40vh", duration: 40 });

    if (device.isIPadOrIPhone) {
        state.tl.to(".SVGs-and-annexes", { width: "40vh", duration: 40 }, "<");
    }

    state.tl
        .to(".rayons", { keyframes: [
            { autoAlpha: 0, duration: 1 },
            { display: "none" }
        ]});

    let screen1_kf1 = { scale: 0.5, duration: 30 };
    let screen1_kf2 = { autoAlpha: 1, scale: 1, duration: 30 };
    if (window.matchMedia("(max-aspect-ratio: 4/3)").matches) {
        screen1_kf1 = { ...screen1_kf1, width: "70vw", height: 0 };
        screen1_kf2 = { ...screen1_kf2, height: "auto" };
    } else {
        screen1_kf1 = { ...screen1_kf1, width: "70%", height: "auto", margin: "0px 0px 0px 4vw" };
    }
    state.tl.to(".text-presentation", { keyframes: [screen1_kf1, screen1_kf2] });

    state.tl
        .to("#bg-screen-1-and-2 > .ray", { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translate(0vh, 0vh)`, duration: 10, stagger: 5 })          
        .addLabel(`step_1_2|${intitulesMenu[1]}`, ">")  
        .to(".pre-screen-3", { left: "0vw", duration: 80 })   
        .to("#content-screen-3", { left: "0vw", duration: 80 }, "<+=30")
        .to("#bg-screen-1-and-2 > .ray", { display: "none" });

    if (window.matchMedia("(max-aspect-ratio: 4/3)").matches) {
        state.tl.to(".text-presentation", { width: "0vw", height: "0vw", margin: 0, duration: 20 }); 
    }

    state.tl 
        .to(".halo", { background: "linear-gradient(29deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)", width: "1%", paddingTop: "1%" })
        .set(".wrapper-SVGs-and-texts", { flexDirection: "unset", textAlign: "unset" });

    if (window.matchMedia("(min-aspect-ratio: 4/3)").matches) {
        state.tl.to(".text-presentation", { width: "0vw", margin: 0, duration: 20 });
    }

    const isViewportMaxHeight600px = window.matchMedia("(max-height: 600px)").matches;
    const sizeHeadOnScreenThree = isViewportMaxHeight600px ? 17 : 20;
    const svgHeadOnScreenThree = () => (isViewportMaxHeight600px) 
                                    ? { marginTop: "-75vh", "--intitule-job-to": 8.5 } 
                                    : { marginTop: "-70vh", "--intitule-job-to": 10 };

    state.tl  
        .set(".text-presentation", { display: "none", clearProps: "width,margin" })
        .to(".halo", { zIndex: 2, autoAlpha: 1, width: "115%", paddingTop: "115%", boxShadow: "-3px 2px 1px #4d4d4d91", duration: 40 })
        .to("#SVGs", { filter: "drop-shadow( 1px 0px 0px rgba(77, 81, 120, 0.7)" }, "<")
        .to(".wrapper-SVGs-and-texts", { keyframes: [
            { position: "absolute", duration: 0 },
            { height: `${sizeHeadOnScreenThree}vh`, ...svgHeadOnScreenThree(), duration: 50 }
        ] }, "<");

    if (device.isIPadOrIPhone) {
        state.tl.to(".SVGs-and-annexes", { width: `${sizeHeadOnScreenThree}vh`, duration: 50 }, "<");
    }

    state.tl
        .to("#intitule-job", { display: "unset" })
        .fromTo("#intitule-job", { zIndex: 3, scale: 0.5, autoAlpha: 0 }, { zIndex: 3, scale: 1, autoAlpha: 1, duration: 10 })
        .fromTo(".section-title#my-skills", 
            { skewX: "0deg", skewY: `${deg_inclinaison_asc}deg`, y: "-100px", display: "inline-block" },
            { skewX: "0deg", skewY: `${deg_inclinaison_asc}deg`, y: "0px", autoAlpha: 1, display: "inline-block", duration: 10 }
        )
        .to("#skills .domain", { transform: `translateY(100vw)`, autoAlpha: 0 });

    const isLandscapeDisplay = window.matchMedia("(orientation: landscape)").matches;
    let screen3_tween = { zIndex: 3, autoAlpha: 1 };
    if ((state.mm === "xs" || state.mm === "s" || state.mm === "m") && !isLandscapeDisplay) {
        screen3_tween = { ...screen3_tween, flexDirection: "column", "--skills-margin-top": isViewportMaxHeight600px ? 26 : 28 };
    }
    state.tl.to("#skills", screen3_tween);

    state.tl
        .to(".half-screen-bg", { transform: `rotate(${deg_inclinaison_asc}deg) skew(${deg_inclinaison_asc}deg, 0) translateX(0vh)`, duration: 30 })
        .to("#shadows", { autoAlpha: 1, duration: 20 })
        .to("#skills .domain", { transform: `translateY(0vw)`, autoAlpha: 1, duration: 30, stagger: 10 })
        .addLabel(`step_2|${intitulesMenu[2]}`, ">")      
        .to("#skills", { duration: 100 })
        .to("#skills .domain", { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha: 0, duration: 20, stagger: 10 })
        .to(".section-title#my-skills", { keyframes: [
            { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha: 0, duration: 20 }, 
            { display: "none" }] 
        })
        .to("#content-screen-4", { top: "0vh", duration: 80 })
        .to(".half-screen-bg", { zIndex: 3 })
        .to(".half-screen-bg", { transform: `rotate(${inclinaison_desc}deg) translateY(0vh)`, "--top-half-screen-bg": 52, height: "80vh", duration: 30 })
        .fromTo(".section-title#my-projects", 
            { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha: 1 }, 
            { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(0vw)`, autoAlpha: 1, display: "inline-block", duration: 15 }
        )
        .fromTo("#content-screen-3", 
            { background: "linear-gradient(29deg, #959ADD 30%, #292C45 80%)" },
            { background: "linear-gradient(-29deg, rgb(122, 221, 212) 0%, rgb(111, 85, 151) 100%)", duration: 80 }
        , "<")
        .to("#intitule-job", { color: "rgb(114, 122, 167)" }, "<")
        .fromTo(".project-card", 
            { "--y-coord": 100, autoAlpha: 1, scale: 1 }, 
            { "--y-coord": 0, autoAlpha: 1, scale: 1, duration: 40 }
        );

    setProjectCards(intitulesMenu[3]);

    state.tl
        .to(".bg-transitional", { keyframes: [
            { autoAlpha: 1 }, 
            { boxShadow: device.isIPadOrIPhone ? "none" : "-100vw 100vw 0 rgba(255,255,255,0.5)", duration: 60 },
            { x: "0%", duration: 80 }] 
        })
        .to("#intitule-job", { keyframes: [
            { scale: 0.5, opacity: 0, duration: 20 }, 
            { display: "none" }] 
        })
        .to(".section-title#my-projects, .halo", { autoAlpha: 0 })
        .to("#SVGs", { filter: `drop-shadow( 0px 0px 1px rgba(0, 0, 0, ${state.mm === "s" || state.mm === "xs" ? .8 : .5}))` }, "<")
        .to("#bg-screen-5", { height: "100vh" });

    if (state.mm === "s" || state.mm === "xs") {
        state.tl
            .to(".wrapper-SVGs-and-texts", { height: "17vmin", marginTop: "-40vmin", duration: 150 })
            .to(".SVGs-and-annexes", { marginRight: "13vw", duration: 150 }, "<");
    } else {
        state.tl
            .to(".wrapper-SVGs-and-texts", { 
                height: (state.mm === "xl" ? "16vmin" : (state.mm === "l" || state.mm === "m" ? "14vmin" : "16vmin")),
                width: "min(80vw, 1200px)",
                marginTop: device.isIPadOrIPhone ? "-14vmin" : "-40vmin",
                duration: 150 
            });
    }

    state.tl
        .to("#SVG-chaise", { display: "initial", x: 0, duration: 50 })
        .to("#SVG-table-sans-pied-BG, #SVG-table-pied-BG", { display: "initial", x: 0, duration: 50 }, "<")
        .to("#SVG-corps, #SVG-bras", { display: "initial", autoAlpha: 1, duration: 50 })
        .to("#SVG-laptop", { keyframes: [
            { display: "block", autoAlpha: 1, duration: 20 },
            { y: 0, duration: 25 }
        ] })
        .to("#SVG-lampe", { keyframes: [
            { display: "block", autoAlpha: 1, duration: 20 },
            { y: 0, duration: 25 }
        ] }, "<+=25")
        .to("#SVG-tasse", { keyframes: [
            { display: "block", autoAlpha: 1, duration: 20 },
            { y: 0, duration: 25 }
        ] }, "<+=25")
        .to("#SVG-ombre", { display: "initial", autoAlpha: 1, duration: 25 });

    if (state.mm === "s" || state.mm === "xs") {  
        state.tl      
            .to(".wrapper-SVGs-and-texts", { marginTop: "10vmin", duration: 150, delay: 100 })
            .to(".bg-transitional", { x: "-55%", rotation: 80, duration: 80 }, "<+=80")
            .to(".msg-remerciements", { keyframes: [
                { display: "flex" }, 
                { autoAlpha: 0, width: "auto", marginTop: "-3dvh", duration: 25 },
                { autoAlpha: 1, duration: 25, delay: 80 }
            ] }, "<")
            .to("#marge-right", { keyframes: [ { display: "initial", x: "-10vw", y: "10dvh", left: 0, rotation: 80, duration: 0 }, { y: "-8dvh", duration: 80 } ] });
    } else {
        state.tl
            .to(".bg-transitional", { x: "-45%", duration: 100, delay: 100 })
            .set(".SVGs-and-annexes", { clearProps: "margin" })
            .to(".SVGs-and-annexes", { margin: "0 20vw 0 7vw", duration: 80 })
            .to(".msg-remerciements", { keyframes: [
                { display: "flex" }, 
                { autoAlpha: 0, width: "auto", duration: 25 },
                { autoAlpha: 1, duration: 25, delay: 80 }
            ] }, "<")
            .to("#marge-right", { display: "initial", transform: "rotate(30deg) translateX(0vw)", duration: 80 });  
    }
    
    if (device.isIPadOrIPhone) {
        state.tl.fromTo(".bg-transitional", 
            { background: "linear-gradient(1deg, rgb(103, 108, 198) 40%, rgb(103, 108, 198) 60%)" }, 
            { background: "linear-gradient(1deg, rgb(103, 108, 198) 40%, rgb(232, 70, 255) 60%)", duration: 80 });
    }
        
    state.tl 
        .to(".msg-remerciements > *", { keyframes: [
            { y: "5vh" },
            { autoAlpha: 1, y: "0vh", duration: 50, stagger: 25 }
        ] }, "<+=20")
        .to(".SVGs-and-annexes", { duration: 25 })
        .addLabel(`step_4|${intitulesMenu[4]}`, ">")  
        .to(".SVGs-and-annexes", { duration: 25 })  
        .to("#bg-screen-end", { clipPath: "circle(100vmax)", duration: 120 })
        .to("#bg-screen-end #mot span", { autoAlpha: 1, scale: 1, duration: 20, stagger: 20 }, "<+=20")
        .to("#bg-screen-end .mot-trait", { width: "clamp(135px, 30vmin, 220px)", duration: 20 })
        .fromTo("#link-back-to-top", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, delay: 10 })    
        .addLabel(`step_final|${intitulesMenu[5]}`, ">");  

    return state.tl;
}

export function initScrollTriggerTimeline() {
    const stConfig = {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true, 
        onUpdate: self => {     
            state.scrolltriggerOnUpdate.progress = self.progress.toFixed(3);
            state.scrolltriggerOnUpdate.direction = self.direction;
            
            // Progress bar
            if (dom.progressBar) {
                dom.progressBar.style.width = `${self.progress * 100}%`;
            }
        },
        onScrubComplete: () => { 
            setSelectedMenu();
        }
    };

    state.tl = gsap.timeline({ scrollTrigger: stConfig });

    ScrollTrigger.addEventListener("refreshInit", () => {
        state.mm = getMedia();
        if (state.tl !== null) state.tl.clear();
        generateTimeline();
        if (!state.flagAnimationIntro) {
            setNavigation();
            setSelectedMenu();
        }
    });

    ScrollTrigger.refresh();
}
