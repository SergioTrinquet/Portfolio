import { dom, state } from './state.js';
import { setNavigation, setSelectedMenu } from './navigation.js';

export function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || (dom.body ? dom.body.scrollTop : 0);
}

export function introduction() {
    const SVGfaceDrawing = document.querySelector("#SVG-face-drawing");
    const SVGs_classList = document.querySelector("#SVGs")?.classList;
    const halo_classList = document.querySelector(".halo")?.classList;
    const rayons_classList = document.querySelector(".rayons")?.classList;
    const btSkipIntro = document.querySelector("#button-skip-intro");

    if (!SVGfaceDrawing || !SVGs_classList || !halo_classList || !rayons_classList || !btSkipIntro) return;

    if (getScrollTop() === 0) {
        dom.body.classList.add("noscroll");
        state.flagAnimationIntro = true;

        dom.texteQuiSuisJeClassList.add("forceNotDisplay");
        dom.texteScrollDownClassList.add("forceNotDisplay");

        const tl_intro = gsap.timeline({
            onComplete: () => { 
                btSkipIntro.disabled = true;
                btSkipIntro.classList.remove('display');

                state.flagAnimationIntro = false; 
                setNavigation();
                setSelectedMenu();
            }
        });

        tl_intro
            .call(() => {
                btSkipIntro.classList.add('display');
                SVGfaceDrawing.classList.add('display'); 
                new Vivus(
                    'SVG-face-drawing', 
                    { duration: 300, type: 'oneByOne' }, 
                    () => { console.log('Animation trait visage réussie'); }
                );
            }, null, "+=1")
            .call(() => {
                SVGs_classList.add('display');
                SVGfaceDrawing.classList.remove('display'); 
            }, null, "+=7")
            .fromTo(".halo", {
                    width: "0%", 
                    paddingTop: "0%"
                }, { 
                    width: "90%", 
                    paddingTop: "90%",
                    ease: "elastic",
                    duration: 2,
                    clearProps: "width,height"
                }
            )
            .call(() => {
                halo_classList.remove('no-transition');
                rayons_classList.add('display');
                dom.texteQuiSuisJeClassList.remove("forceNotDisplay");
                dom.texteQuiSuisJeClassList.add('animation');
            })
            .call(() => { 
                dom.body.classList.remove('noscroll');
                dom.texteScrollDownClassList.remove("forceNotDisplay");
                dom.texteScrollDownClassList.add('display');
            }, null, "+=2");

        btSkipIntro.addEventListener("click", () => {
            tl_intro.progress(1);
        });

    } else {
        SVGs_classList.add('display');
        SVGs_classList.add('no-transition');
    }
}

export function postIntroduction() {
    if (dom.texteQuiSuisJeClassList.contains('animation')) {
        dom.texteQuiSuisJeClassList.remove('animation');
    }
    const scrollValue = getScrollTop();
    const limitNbPx = 200;             
    dom.texteScrollDownClassList.toggle('display', (scrollValue < limitNbPx));
    dom.texteQuiSuisJeClassList.toggle('display', (scrollValue < limitNbPx));
}
