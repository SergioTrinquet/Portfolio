//////////
// Encapsulation code (au cas ou l'on ajouterait librairie externe ou code maison 
// dans un autre fichier, qui pourrait générer des conflits - même noms de variables, fonctions par exemple- )
(function () {
//////////

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);    // 'ScrollToPlugin' pour le "scrollTo"

    let tl = null;
    const body = document.querySelector("body");
    const texteQuiSuisJe_classList = document.querySelector(".texteQuiSuisJe").classList,
          texteScrollDown_classList = document.querySelector(".texteScrollDown").classList;
    let dataLabelsExceptProjects = [];
    let ratio = null;
    const prefixNomLabelProjets = "step_3";
    let mm = null;
    let flagAnimationIntro = false;
    let tweenScrollToLabelOnComplete = true;
    let scrolltriggerOnUpdate = {
        progress: null,
        direction: 1
    };
    let menuOrArrowClicked = false;
    const isMobileOrTablette = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || 
                                (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)) ||
                                window.matchMedia("only screen and (hover: none) and (pointer: coarse)").matches;

    const isIPadOrIPhone = detectIOS();
    function detectIOS() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAppleDevice = navigator.userAgent.includes('Macintosh');
        const isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)
        const iOS1to12quirk = () => {
            var audio = new Audio(); // temporary Audio object
            audio.volume = 0.5; // has no effect on iOS <= 12
            return audio.volume === 1;
        }
        return isIOS || (isAppleDevice && (isTouchScreen || iOS1to12quirk()));
    }

    /* JUSTE POUR PHASE DE TEST */ document.querySelector("#iOSdevices").innerText = isIPadOrIPhone ? "iPhone/iPad" : "Autre"; //TEST

    let scrubValue = 1; /* VOIR CE QUE L'ON EN FAIT !!! */



    // Gestion modal avec msg d'incitat° de consultation en mode portrait qd mobile
    createModalPortraitIsBetter("st_dont-show-modal");



    // Code juste pour mobile : Correct° du bug sur mobile et tablettes => unité du type vh, vmax, vmin,... sont faussées à cause de la barre d'adresse qui coulisse qd scroll et qui couvre une partie de l'écran.
    // Il faut donc recalculer la valeur d'un vh/vmax/vmin à chaque évènement (resize', chgmt d'orientat°) qui fait varier cette unité.
    if (isMobileOrTablette) {
        function setCSSunits() {
            let h = window.innerHeight;
            let w = window.innerWidth;
            let max = (h - w > 0) ? h : w;
            let min = (h - w < 0) ? h : w;
            document.documentElement.style.setProperty('--vh', `${h/100}px`);
            document.documentElement.style.setProperty('--vmax', `${max/100}px`);
            document.documentElement.style.setProperty('--vmin', `${min/100}px`);
            document.querySelector("#hauteurOneVh").innerText = `${h/100}px`; // JUSTE POUR PHASE DE TEST
        };
        window.addEventListener('resize', setCSSunits);
        //window.addEventListener('orientationchange', setCSSunits); // obsolète
        window.matchMedia("(orientation: landscape)").onchange = setCSSunits;
        setCSSunits();

        //scrubValue = 0.1;
    }
    // console.log("TEST", document.documentElement.style.getPropertyValue("--vh"));


    // Animation d'intro
    function introduction() {
        const SVGvisageVIVUS = document.querySelector("#SVGvisageVIVUS"),
            SVGs_classList = document.querySelector("#SVGs").classList,
            halo_classList = document.querySelector(".halo").classList,
            rayons_classList = document.querySelector(".rayons").classList,
            btSkipIntro = document.querySelector("#buttonSkipIntro");

        // Si on est en haut de page, ajout de la transition pour l'apparition du visage
        if(getScrollTop() == 0) {

            body.classList.add("noscroll"); // On empeche l'utilisateur de scroller   
            flagAnimationIntro = true;

            // Code pour corriger bug Android qd reload
            texteQuiSuisJe_classList.add("forceNotDisplay");
            texteScrollDown_classList.add("forceNotDisplay");

            const tl_intro = gsap.timeline({
                onComplete: () => { 
                    btSkipIntro.disabled = true;
                    btSkipIntro.classList.remove('display');

                    flagAnimationIntro = false; 
                    setNavigation();
                    setSelectedMenu();
                }
            });

            tl_intro
                .add(() => {
                    btSkipIntro.classList.add('display');
                    SVGvisageVIVUS.classList.add('display'); 
                    // Animation dessin du visage
                    new Vivus(
                        'SVGvisageVIVUS', 
                        { duration: 300, type: 'oneByOne' }, 
                        () => { console.log('Animation trait visage réussie') }
                    );
                }, "+=1")
                .add(() => {
                    // On cache le SVG utilisé pour l'animation avec les traits et on fait apparaitre l'autre
                    SVGs_classList.add('display');
                    SVGvisageVIVUS.classList.remove('display'); 
                }, "+=7")
                .fromTo(".halo", {
                        width: "0%", 
                        paddingTop: "0%"
                    }, { 
                        width: "90%", 
                        paddingTop: "90%",
                        ease: "elastic",
                        duration: 2,
                        clearProps: "width,height" // Retrait de ces inline styles car faussent après l'animation
                    }
                )
                .add(() => {
                    halo_classList.remove('noTransition');
                }) 
                .add(() => {
                    rayons_classList.add('display');
                    texteQuiSuisJe_classList.remove("forceNotDisplay"); // Code pour corriger bug Android qd reload
                    texteQuiSuisJe_classList.add('animation');
                })
                .add(() => { 
                    body.classList.remove('noscroll'); // Retrait de la class qui empeche de scroller
                    texteScrollDown_classList.remove("forceNotDisplay"); // Code pour corriger bug Android qd reload
                    texteScrollDown_classList.add('display'); // Affichage txt 'Descendez pour le savoir'       
                }, "+=2");

            // Pour skipper l'intro
            btSkipIntro.addEventListener("click", () => {
                tl_intro.progress(1); // On va directement à la fin de la timeline
            });

        } else {
            SVGs_classList.add('display');
            SVGs_classList.add('noTransition');
        }

    }
    introduction();




    // GSAP : Config du ScrollTrigger
    const st = {
        trigger: "body",
        start: "top top",
        end: `bottom bottom`,
        scrub: scrubValue, // Valeur 0.1 si mobile/tablette, sinon 1
        // Option snap retirée au profit de méthode 'scrollTo' qui est plus réactive
        /* snap: { 
            snapTo: "labelsDirectional", 
            duration: {min: 0.2, max: 2.5},
            delay: 0,
            //ease: "slow",
            ease: "none",
            inertia: false
        }, */
        // markers: true,
        invalidateOnRefresh: true, 
        onUpdate: self => {     
            //console.log("onUpdate => progress: ", self.progress.toFixed(3), "self.direction: ", self.direction); //TEST
            scrolltriggerOnUpdate.progress = self.progress.toFixed(3);
            scrolltriggerOnUpdate.direction = self.direction;

            // Calcul largeur progress bar
            animateProgressBar(scrolltriggerOnUpdate.progress);
        },
        onScrubComplete: () => { 
            setSelectedMenu(); // Mise en valeur du menu sur lequel on est
        }
    };

    // GSAP : Création de la timeline
    const tl_scrollTriggerBody = gsap.timeline({
        scrollTrigger: st
        //, onComplete: () => { console.log("animation terminée !"); }
    });


    window.addEventListener('scroll', () => {
        triggerGoToLabel();
        postIntroduction();
    }, false);


    // Appel fonction pour se rendre au label désiré qd scroll
    let nbExecScrollEvent = -1,
        isScrolling = null;
    function triggerGoToLabel() {
        // Appel fct° pour aller au label suivant/précédent qd : 
        // 1. Tween précédent dû au scroll pour se rendre vers un label, est terminé
        // 2. Début de ce scroll exclusivement 
        // 3. Scroll n'est pas dû à utilisat° du menu ou des fleches de nav. ds sect° 'Projets perso'
        if(
            tweenScrollToLabelOnComplete == true && 
            nbExecScrollEvent == 0 && 
            menuOrArrowClicked == false
        ) goToLabel();

        nbExecScrollEvent++;   
        
        // Code ds le setTimeout exécuté que qd le scroll s'arrête
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            nbExecScrollEvent = 0; // Réinitialisation
            console.log('Scrolling has stopped.'); //TEST
        }, 66);
    }


    function postIntroduction() {
        // Pour supprimer class 'animation' dès que l'on scroll, car empeche le DOM de ne plus s'afficher!
        if(texteQuiSuisJe_classList.contains('animation')) {
            texteQuiSuisJe_classList.remove('animation');
        }
        // Retrait élements DOM de l'intro qd scroll vers le bas
        const scrollValue = getScrollTop(),
                limitNbPx = 200;             
        texteScrollDown_classList.toggle('display', (scrollValue < limitNbPx));
        texteQuiSuisJe_classList.toggle('display', (scrollValue < limitNbPx));
    }



    // Pour se déplacer d'un label à un autre qd scroll, 
    // avec méthode '.scrollTo()' (different de prop. 'snap' dans config du ScrollTrigger)
    const dureeEntreLabels = [1.7, 2.6, 2.7, 0.8, 0.8, 6, 1.5];
    function goToLabel() {
        //console.log(tl_scrollTriggerBody.labels); //TEST
        const direction = scrolltriggerOnUpdate.direction;
        const totalDuration = tl_scrollTriggerBody.totalDuration();
        let instantDuration = totalDuration * scrolltriggerOnUpdate.progress; // Pour savoir ou on en est qd on commence à toucher au scroll
        // Ajout marge de sécurité pour le test car ne s'arrete pas exactement au niveau du label : Manque de précision pris en compte de cette façon pour le test qui suit 
        const marge = 50;
        instantDuration = (direction == 1) ? instantDuration += marge : instantDuration -= marge;

        //let valueJustBefore = null, valueJustAfter = null;
        let durationBetweenLabels = null, i = 0;
        let nomLabelBefore = null, nomLabelAfter = null;
        for (const [key, value] of Object.entries(tl_scrollTriggerBody.labels)) {
            if(instantDuration > value) {
                //valueJustBefore = value;
                durationBetweenLabels = dureeEntreLabels[i];
                nomLabelBefore = key;
            }
            if(instantDuration < value) {
                //valueJustAfter = value;
                durationBetweenLabels = dureeEntreLabels[i - 1];
                nomLabelAfter = key;
                break;
            }
            i++;
        }
        
        //const labelToGoTo = (direction == 1) ? valueJustAfter : valueJustBefore;
        const nomLabelToGo = (direction == 1) ? nomLabelAfter : nomLabelBefore; //console.log("nomLabelToGo", nomLabelToGo, "Position  Label: ", tl_scrollTriggerBody.scrollTrigger.labelToScroll(nomLabelToGo)) //TEST
        
        tweenScrollToLabelOnComplete = false;
        // Smooth scrolling vers le label précédent ou suivant
        gsap.to(window, {
            duration: durationBetweenLabels, 
            //scrollTo: { y: (ratio * parseFloat(labelToGoTo)), autokill: false },
            scrollTo: { y: tl_scrollTriggerBody.scrollTrigger.labelToScroll(nomLabelToGo), autokill: false }, // Autokill à 'false' pour empecher interrupt° du scroll vers le label en court de scroll en cas d'intervent° de l'utilisateur  // ATTENTION: ".labelToScroll()" Ne fctionne qu'à partir de la version 3.9 de GSAP !!
            ease: "slow",
            onComplete:  () => { 
                tweenScrollToLabelOnComplete = true; 
                console.log("Tween finished !!"); //TEST
            }
        });             
    }





    // Fonction d'"alimentation" de l'objet timeline. Est appelée au chargement de la page 
    // mais aussi qd redimensionnement (sur event 'refreshInit') pour recalculer les positions de tous les éléments (sinon décalages potentiels)
    const deg_inclinaison_asc = "-8",
        inclinaison_desc = parseInt(deg_inclinaison_asc) * -1,
        intitulesMenu = ["Intro", "Qui je suis", "Compétences", "Projets perso", "Mon CV", "Fin"];
    function generate_timeline() {

        // Suppression du CSS dans les balises styles ajouté par GSAP
        tl_scrollTriggerBody
            .set(`.wrapperSVGsAndTexts, .rayons, .textePresentation, #background_screen1and2 > .ray, 
            #content_screen3, .PreScreen3, #content_screen3 #shadows > div, .halo, .backgroundHalfScreen, #skills .domain, .domain .title, #SVGs, #intituleJob, #content_screen4, #sectionTitles .sectionTitle, #skills, 
            #background_screen5, #SVG_chaise, #SVG_tableSansPiedBG, #SVG_tablePiedBG, #SVG_corps, #SVG_bras,#SVG_laptop, #SVG_lampe, #SVG_tasse, #SVG_ombre, .msgRemerciements, .msgRemerciements > *, #margeRight,
            #background_screenEnd, #background_screenEnd #mot span, #background_screenEnd .motTrait, .transitionalBackground, .SVGsAndAnnexes
            `, {clearProps: "all"});
                
        if(isIPadOrIPhone) tl_scrollTriggerBody.set(".SVGsAndAnnexes", { width: "70vmin" }); // Pour iOS, contairement à Android et nav. PC, on doit donner une largeur a cet élément pour qu'il y ait animation, sinon change de dimension "par à-coups"

        tl_scrollTriggerBody
            .addLabel(`step_1_1|${intitulesMenu[0]}`, ">")
            // Agrandissement wrapper contenant svgs + texte présentation
            .to(".wrapperSVGsAndTexts", { width: "70vw", height: "40vh", duration: 40 });

        if(isIPadOrIPhone) tl_scrollTriggerBody.to(".SVGsAndAnnexes", { width: "40vh", duration: 40 }, "<"); // Pour iOS, contairement à Android et nav. PC, on doit donner une largeur a cet élément pour qu'il y ait animation, sinon change de dimension "par à-coups"
    
        tl_scrollTriggerBody
            // Disparition rayons
            .to(".rayons", { keyframes: [
                { autoAlpha: 0, duration: 1 },
                { display: "none" } // Pour ne pas utiliser de resources CPU car l'élément n'est plus rendered 
            ]});

        // Apparition texte présentation : gestion de la transition différente selon ratio largeur/hauteur de l'écran
        let screen1_kf1 = { scale: 0.5, duration: 30 };
        let screen1_kf2 = { autoAlpha: 1, scale: 1, duration: 30 };
        if(window.matchMedia("(max-aspect-ratio: 4/3)").matches) {
            screen1_kf1 = {...screen1_kf1, ...{ width:"70vw", height: 0 }};
            screen1_kf2 = {...screen1_kf2, ...{ height: "auto" }};
        } else {
            screen1_kf1 = {...screen1_kf1, ...{ width:"70%", height: "auto", margin: "0px 0px 0px 4vw" }};
        }
        tl_scrollTriggerBody.to(".textePresentation", { keyframes: [screen1_kf1, screen1_kf2]});


        tl_scrollTriggerBody
            .to("#background_screen1and2 > .ray", { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translate(0vh, 0vh)`, duration: 10, stagger: 5 })    // ray en diagonale : Apparition de gauche à droite        
            .addLabel(`step_1_2|${intitulesMenu[1]}`, ">")  
            .to(".PreScreen3", { left:"0vw", duration: 80 })   
            .to("#content_screen3", { left:"0vw", duration: 80 }, "<+=30"); // Transition arrivée fond bleu marine

        // Transition seulement qd écran moins large que 4/3     
        if(window.matchMedia("(max-aspect-ratio: 4/3)").matches) {
            tl_scrollTriggerBody.to(".textePresentation", { width:"0vw", height: "0vw", margin: 0, duration: 20 }); 
        }

        tl_scrollTriggerBody 
            .set(".halo", { clearProps: "all" }) // Pour supprimer le style "background" écrit en dur ds la propriété style quand on a passé le tween juste après celui-ci et que l'on revient en arrière
            .to(".halo", { autoAlpha:0, background: "linear-gradient(29deg, rgb(255, 255, 255) 100%, rgb(255, 255, 255) 100%)" })
            .set(".wrapperSVGsAndTexts", { flexDirection: "unset", textAlign: "unset" }); // Retrait style qui permet affichage en colonne pour small devices/small screens

        // Gestion de la transition seulement qd écran plus large que 4/3
        if(window.matchMedia("(min-aspect-ratio: 4/3)").matches) {
            tl_scrollTriggerBody.to(".textePresentation", { width:"0vw", margin: 0, duration: 20 }); // SVG du visage qui va vers le centre de la page car textePresentation se réduit progressivement
        }

        tl_scrollTriggerBody  
            .to(".halo", { zIndex: 2, width: "115%", paddingTop: "115%", boxShadow: "-3px 2px 1px #4d4d4d91", autoAlpha:1, duration: 20 })    // Halo rendu à nouveau visible + chgmt css
            .to("#SVGs", { filter: "drop-shadow( 1px 0px 0px rgba(77, 81, 120, 0.7)" }, "<")   // Ajout ombre sur visage
            .to(".wrapperSVGsAndTexts", { keyframes: [
                { position: "absolute", duration: 0 },
                { height: "20vh", marginTop: isIPadOrIPhone ? "-35vh" : "-70vh", duration: 50 }
            ] }, "<");

        if(isIPadOrIPhone) tl_scrollTriggerBody.to(".SVGsAndAnnexes", { width: "20vh", duration: 50 }, "<"); // Pour iOS, contairement à Android et nav. PC, on doit donner une largeur a cet élément pour qu'il y ait animation, sinon change de dimension "par à-coups"

        tl_scrollTriggerBody
            .to("#intituleJob", { display: "unset" }) // Pour activer l'animation
            .fromTo("#intituleJob", { zIndex: 3, scale: 0.5, autoAlpha:0 }, { zIndex: 3, scale: 1, autoAlpha: 1, duration: 10})   // Apparition "intitulé job"
            .to(".textePresentation", { width:"0vw", duration: 0 })  // On réduit à 0 la largeur du texte de présentation (même s'il n'est plus visible grâce au background) pour que '#skills' s'affiche au même endroit
            .fromTo(".sectionTitle#mySkills", 
                { skewX: "0deg", skewY: `${deg_inclinaison_asc}deg`, y: "-100px", display: "inline-block" },
                { skewX: "0deg", skewY: `${deg_inclinaison_asc}deg`, y: "0px", autoAlpha: 1, display: "inline-block", duration: 10 }
            )   // Apparition titre "Mes compétences"
            .to("#skills .domain", { transform: `translateY(100vw)`, autoAlpha:0 });


        // En gérant du coté JS "flex-direction", on évite un bug d'affichage: Le SVG changeait brusquement de position
        const isLandscapeDisplay = window.matchMedia("(orientation: landscape)").matches;
        let screen3_tween = { zIndex: 3, autoAlpha: 1 };
        // Si petit écran ET en portrait...
        if( (mm == "xs" || mm == "s" || mm == "m") && !isLandscapeDisplay) {
            screen3_tween = {...screen3_tween, ...{ flexDirection:"column", marginTop: "calc(var(--vh, 1vh) * 30)" }};
        }
        tl_scrollTriggerBody.to("#skills", screen3_tween);


        tl_scrollTriggerBody
            .to(".backgroundHalfScreen", { transform: `rotate(${deg_inclinaison_asc}deg) skew(${deg_inclinaison_asc}deg, 0) translateX(0vh)`, duration: 30 })  // Apparition partie médiane background clair
            .to("#shadows", {autoAlpha:1, duration: 20})
            .to("#skills .domain", { transform:`translateY(0vw)`, autoAlpha:1, duration: 30, stagger:10 })      // Animation arrivée encarts "compétences"    
            .addLabel(`step_2|${intitulesMenu[2]}`, ">")      
            .to("#skills", { duration: 100 })    // Pour faire une pause dans l'animation le temps de pouvoir lire le contenu de la page
            .to("#skills .domain", { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha:0, duration: 20, stagger:10 })      // Animation retrait encarts "compétences"
            .to(".sectionTitle#mySkills", { keyframes: [
                { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha: 0, duration: 20 }, 
                { display: "none" }] 
            })   // Animation retrait titre "Mes compétences"
            .to("#content_screen4", { top:"0vh", duration: 80 })    // Apparition contenu section 3
            .to(".backgroundHalfScreen", { zIndex: 3 })
            .to(".backgroundHalfScreen", { transform: `rotate(${inclinaison_desc}deg) translateY(0vh)`, top: "52vh", height: "80vh", duration: 30 }) // Changement inclinaison/extension partie médiane du background clair
            .fromTo(".sectionTitle#myProjects", 
                { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(100vw)`, autoAlpha: 1 }, 
                { transform: `skew(0deg, ${deg_inclinaison_asc}deg) translateX(0vw)`, autoAlpha: 1, display: "inline-block", duration: 15}
            )   // Animation titre "Mes projets perso"
            .fromTo("#content_screen3", 
                { background: "linear-gradient(29deg, #959ADD 30%, #292C45 80%)" },
                { background: "linear-gradient(-29deg, rgb(122, 221, 212) 0%, rgb(111, 85, 151) 100%)", duration: 80 }
            , "<")
            .to("#intituleJob", { color: "rgb(114, 122, 167)" }, "<")
            .fromTo(".projectCard", 
                { x: "100vw" }, 
                { x: "0vw", duration:40, stagger: 10 }
            ); // Arrivée encarts projets venant de la droite
            
        // Ajout projets
        setProjectCards(intitulesMenu[3]);

        tl_scrollTriggerBody
            .to(".transitionalBackground", { keyframes: [
                { autoAlpha: 1 }, 
                { boxShadow: isIPadOrIPhone ? "none" : "-100vw 0 0 rgba(255,255,255,0.5)", duration: 60 },
                { x:"0%", duration: 80 }] 
            })
            .to("#intituleJob", { keyframes: [
                {scale: 0.5, opacity: 0, duration: 20 }, 
                { display: "none" }] 
            })   // Disparition texte intitulé job et 'display: none' pour désactiver l'animation
            .to(".sectionTitle#myProjects, .halo", { autoAlpha:0 }) // Disparition halo et titre "Projets perso"
            .to("#SVGs", { filter: `drop-shadow( 0px 0px 1px rgba(0, 0, 0, ${mm == "s" || mm == "xs" ? .8 : .5}))` }, "<")   // Ajout ombre sur visage              
            .to("#background_screen5", { height: "100vh" });    // Apparition fond degr. gris/blanc

        // Gestion animation selon taille écran
        if(mm == "s" || mm == "xs") {
            tl_scrollTriggerBody
                .to(".wrapperSVGsAndTexts", { height: "17vmin", marginTop: "-40vmin", duration: 150 }) // SVG visage qui remonte en haut de l'écran qd pas petit écran
                .to(".textePresentation", { margin: "0 0 0 13vw", duration: 150 }, "<") // Pour décaler les SVG vers la gauche afin qu'ils soient centrés sur la page
        } else {
            tl_scrollTriggerBody
                .to(".wrapperSVGsAndTexts", 
                { 
                    height: (mm == "xl" ? "16vmin" : (mm == "l" || mm == "m" ? "14vmin" : "16vmin")), // 16vmin pour xl et xs, sinon 14vmin
                    marginTop: isIPadOrIPhone ? "-14vmin" : "-40vmin",
                    duration: 150 
                })
        }

        // Animations et apparitions éléments SVG
        tl_scrollTriggerBody
            .to("#SVG_chaise", { display: "initial", x:0, duration: 50 })
            .to("#SVG_tableSansPiedBG, #SVG_tablePiedBG", { display: "initial", x:0, duration: 50 }, "<")
            .to("#SVG_corps, #SVG_bras", { display: "initial", autoAlpha:1, duration: 50 })
            .to("#SVG_laptop", { keyframes: [
                { display: "block", autoAlpha: 1, duration: 20 },
                { y:0, duration: 25 }
            ] })
            .to("#SVG_lampe", { keyframes: [
                { display: "block", autoAlpha: 1, duration: 20 },
                { y:0, duration: 25 }
            ] }, "<+=25")
            .to("#SVG_tasse", { keyframes: [
                { display: "block", autoAlpha: 1, duration: 20 },
                { y:0, duration: 25 }
            ] }, "<+=25")
            .to("#SVG_ombre", { display: "initial", autoAlpha:1, duration: 25 });


        if(mm == "s" || mm == "xs") {  
            tl_scrollTriggerBody      
                .to(".wrapperSVGsAndTexts", { marginTop: (mm == "s" ? "10vmin" : "30vmin"), duration: 150, delay: 100 }) // SVG visage qui descend en bas de l'écran
                .to(".transitionalBackground", { x:"-55%", rotation: 80, duration: 80 }, "<+=80") // Décalage fond oblique bleu/violet
                .to(".msgRemerciements", { keyframes: [
                    { display: "flex"}, 
                    { autoAlpha:0, flexGrow: "1", width: "auto", duration: 25 },
                    { autoAlpha:1, duration: 25, delay: 80 }
                ] }, "<") // Apparition message "A bientôt" 
                .to("#margeRight", { keyframes: [ {display: "initial", rotation: 80}, { x: "-10vw", y:0 , left: 0, duration: 80 } ] });
        } else {
            tl_scrollTriggerBody
                .to(".transitionalBackground", { x:"-45%", duration: 100, delay: 100 }) // Décalage fond oblique bleu/violet
                .set(".SVGsAndAnnexes", { clearProps: "margin" }) // Pour supprimer le style en dur qui reste qd retour en arrière après avoir passé le tween suivant, car fausse la position
                .to(".SVGsAndAnnexes", { margin: "0 0 0 7vw", duration: 80 }) // Décalage SVGs vers la droite
                .to(".textePresentation", { margin: "0 0 0 20vw", duration: 80 }, "<") // Pour décaler les SVG vers la gauche afin qu'ils soient centrés sur la page
                .to(".msgRemerciements", { keyframes: [
                    { display: "flex"}, 
                    { autoAlpha:0, flexGrow: "1", width: "auto", duration: 25 },
                    { autoAlpha:1, duration: 25, delay:80 }
                ] }, "<") // Apparition message "A bientôt"  
                .to("#margeRight", { display: "initial", transform: "rotate(30deg) translateX(0vw)", duration: 80 });   
        }

        
        if(isIPadOrIPhone) {
            //Ici couleurs pas sous forme de variables CSS car sinon pas de transition
            tl_scrollTriggerBody.fromTo(".transitionalBackground", 
                    { background: "linear-gradient(1deg, rgb(103, 108, 198) 40%, rgb(103, 108, 198) 60%)" }, 
                    { background: "linear-gradient(1deg, rgb(103, 108, 198) 40%, rgb(232, 70, 255) 60%)", duration: 80});
        }
        
            
        tl_scrollTriggerBody 
            .to(".msgRemerciements > *", { autoAlpha:1, y: 0, duration: 50, stagger: 25 })
            .addLabel(`step_4|${intitulesMenu[4]}`, ">")  
            .to("#background_screenEnd", { clipPath: "circle(100vmax)", duration: 120 })
            .to("#background_screenEnd #mot span", { autoAlpha:1, scale:1, duration: 20, stagger: 20 }, "<+=20")
            .to("#background_screenEnd .motTrait", { width: "clamp(135px, 30vmin, 220px)", duration: 20 })
            .fromTo("#linkbackToTop", { autoAlpha: 0, y:20  }, { autoAlpha:1, y:0, duration: 1, delay: 10 })    
            .addLabel(`step_final|${intitulesMenu[5]}`, ">");  

        return tl_scrollTriggerBody;
    }


    // Pour regénérer la timeline à chaque redimensionnement de la fenetre, sinon décalages se produisent car les prop. CSS de 
    // dimensions relatives (en vw, vh, %,...) sont interprétées une seule fois à l'initialisation de la timeline avec GSAP
    ScrollTrigger.addEventListener("refreshInit", () => {
        mm = getMedia();
        if(tl !== null) tl.clear(); // Prise en compte 1er déclenchement de l'evenement 'refreshInit' au chargement de la pg ou tl est = à null
        tl = generate_timeline();
        if(!flagAnimationIntro) setNavigation(); setSelectedMenu(); // Ici ajouté car qd redimension de la fenêtre, les valeurs des labels utilisés dans cette fonction changent, donc fonction rappelée ici pour avoir les valeurs à jour, sinon décalage entre vrais positions des labels et positions calculées
    });



    // Affichage et animation sur un tracé circulaire de l'intitulé du job
    const intituleJob = document.querySelector("#intituleJob");
    // 'translateZ(0)' ajouté pour bénéficier de l'Activation Matérielle pour soulager le CPU ou GPU
    intituleJob.innerHTML = intituleJob.innerText.split("").map((char, i) =>
        `<span style="transform:rotate(${(i * 6.5) - 80}deg) translateZ(0);">${char}</span>`
    ).join("");



    // Calcul largeur progress bar
    const progressBar = document.querySelector("#progressBar");
    function animateProgressBar(progress) {
        progressBar.style.width = `${progress * 100}%`;
    }


    // Bouton "retour au début" en fin d'animation
    document.querySelector("#linkbackToTop").addEventListener("click", () => {
        tl.progress(0); // Animation au début
        document.documentElement.scrollTop = body.scrollTop = 0; // Scroll en haut de page
        setSelectedMenu(); // Mise à jour sélection du menu
    });


    // Appelé pour connaitre taille de l'écran et adapter en fonction l'affichage
    function getMedia() {
        /*
        320px — 480px: Mobile devices => s
        481px — 768px: iPads, Tablets => m
        769px — 1024px: Small screens, laptops  => l
        1025px — 1200px: Desktops, large screens    => xl
        */
        let kindOfmedia = null;
        if(window.matchMedia("(min-width: 1025px)").matches) {
            kindOfmedia = "xl";
        } else if(window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches) {
            kindOfmedia = "l";
        } else if(window.matchMedia("(min-width: 481px) and (max-width: 768px)").matches) {
            kindOfmedia = "m";
        } else if(window.matchMedia("(min-width: 381px) and (max-width: 480px)").matches) {
            kindOfmedia = "s";
        } else if(window.matchMedia("(max-width: 380px)").matches) {
            kindOfmedia = "xs";
        }

        return kindOfmedia;
    }



    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || body.scrollTop;
    }



    // Ajout dynamique des projets dans la timeline
    const nbProjectCards = document.querySelectorAll("#projects .projectCard").length;
    function setProjectCards(intituleMenu) {
        let units = 100;
        let coordX = 0;
        for(var i = 1; i <= nbProjectCards; i++) {
            coordX -= units;
            tl_scrollTriggerBody
                .to(".projectCard", { duration: 25 })
                .addLabel(`${prefixNomLabelProjets}_${i}|${intituleMenu}`, ">") 
                .to(".projectCard", { x: `${coordX}vw`, duration: 80, stagger: 10 })
                .to(".projectCard", { duration: 25 }) // Pour que l'on reste sur un projet qd on scroll, sinon effet d'inertie et passe au label suivant
        }
        return tl_scrollTriggerBody;
    }



    const menu = document.querySelector(".menu"),
        smallMenu = document.querySelector("#smallMenu"),
        smallMenuSections = smallMenu.querySelector("#listeSections");
        
    // Gestion affichage menu small qd click sur icone
    smallMenu.querySelector(".iconeMenu").addEventListener("click", displaySmallMenu );
    smallMenu.querySelector(".overlay").addEventListener("click", displaySmallMenu );
    function displaySmallMenu() {
        smallMenu.querySelector(".overlay").classList.toggle("display");
        smallMenuSections.classList.toggle("open");
    }


    // Création bon menu de navigation selon la taille de l'écran
    function setNavigation() {              
        //console.log("tl_scrollTriggerBody.labels", tl_scrollTriggerBody.labels); //TEST
        if(ratio == null) ratio = getRatio(); // Calcul juste 1 fois au chargement, pas besoin d'être appelé plus
        
        // Génération du bon menu en fonction de la taille de l'écran
        let menuTag = null;
        let force = false;
        // Taille d'écran s et xs qd PC, sinon ttes les tailles qd écrans tactiles (mobile/tablette)
        if(mm == "xs" || mm == "s" || window.matchMedia("only screen and (hover: none) and (pointer: coarse)").matches) { 
            force = !force;
            menuTag = smallMenuSections;
        } else if(mm == "m" || mm == "l" || mm == "xl") { // Tailles m et <m pour PC seulement
            menuTag = menu;
        }
        smallMenu.classList.toggle("display", force);
        menu.classList.toggle("display", !force);

        generateMenu(menuTag, force);  // Création navigation générale
        generateProjectsNavigation(); // Création navigation entre projets perso
    }


    // Calcul du ratio pour savoir combien de pixels à scroller correspondent à une unité de durée de la timeline
    function getRatio() {
        const maxScroll = ScrollTrigger.maxScroll(window);
        const totalDuration = tl_scrollTriggerBody.totalDuration();
        return maxScroll / totalDuration;
    }


    // Génération du menu de navigation
    function generateMenu(m, isMenuSmall) {
        let flag = false;

        m.innerHTML = ""; // On vide balise au cas ou elle aurait déjà été alimentée
        dataLabelsExceptProjects = []; // On réinitialise le tableau

        // Génération des menus qui correspondent aux labels
        for (const [key, value] of Object.entries(tl_scrollTriggerBody.labels)) {
            // Exclusion des labels correspondants aux projets persos (sauf le premier)
            if(key.startsWith(prefixNomLabelProjets) && flag == false || !(key.startsWith(prefixNomLabelProjets))) {
                dataLabelsExceptProjects.push({ k: key, v: value });
                
                m.innerHTML += `<div class='link' data-timeline='_${value}'>
                    <span>${key.substring(key.indexOf("|") + 1, key.length)}</span>
                </div>`;
            }
            if(key.startsWith(prefixNomLabelProjets) && flag == false) flag = true;
        }

        // Ajout évènement sur points/sections pour scroller jusqu'au label choisi
        m.querySelectorAll(".link").forEach(l => {
            l.addEventListener("click", () => {
                menuOrArrowClicked = true;
                gsap.to(window, { 
                    duration: 6, 
                    scrollTo: (ratio * parseFloat(l.dataset.timeline.substring(1))), 
                    ease: /* "sine" */ "slow",
                    onComplete:  () => { menuOrArrowClicked = false }
                });     // Fonctionne grace au plugin 'ScrollToPlugin'
                if(isMenuSmall) displaySmallMenu(); // Pour menu sur ecran small
            })
        })
    }



    // Génération des flèches pour naviguer d'un projet à un autre dans la rubrique "Projets perso"
    function generateProjectsNavigation() {
        let navigation_projects = [];

        for (const key in tl_scrollTriggerBody.labels) {
            if(key.startsWith(prefixNomLabelProjets)) { 
                navigation_projects.push({ back: true, forth: true, nomLabel: key }) 
            }
        }

        if(navigation_projects.length > 0) {
            navigation_projects[0].back = false; // 1er record
            navigation_projects[navigation_projects.length - 1].forth = false; // dernier record
        }
        
        const index = (`${prefixNomLabelProjets}_`).length;
        const duree = 1;
        const easing = "power1"; /* "linear" */;
        let i = 0;
        document.querySelectorAll(".projectCard").forEach(p => {
            const leftArrow = p.querySelector(".navigation [data-direction='left']");
            const rightArrow = p.querySelector(".navigation [data-direction='right']");
            
            // Obtention nom des labels précédent/suivant...
            const nomLabel = navigation_projects[i].nomLabel;
            const part1 = nomLabel.substring(0, index);
            const part2 = nomLabel.substring(index + 1);

            // Pour empecher affichage fleches de navigation qd iOS (avec Safari ou autres) car ne fonctionnent pas et fait bugger reste de la navigation
            if(isIPadOrIPhone) navigation_projects[i].back = navigation_projects[i].forth = false;

            if(navigation_projects[i].back == false) { 
                leftArrow.classList.add("hidden"); // Gestion affichage des flèches de navigation
            } else {
                // Obtention nom du label précédent...
                const nomPreviousLabel = part1 + i + part2;
                // ...Pour avoir le temps écoulé entre le début de la timeline et ce label en question (=> Où le label est positionné dans la timeline) 
                const totalTimePreviousLabel = tl_scrollTriggerBody.labels[nomPreviousLabel.toString()];

                leftArrow.addEventListener("click", () => {
                    menuOrArrowClicked = true;
                    gsap.to(window, {duration: duree, scrollTo: {y: (ratio * parseFloat(totalTimePreviousLabel)), autoKill: true}, ease: easing, onComplete: () => { menuOrArrowClicked = false } }); 
                })
            }

            if(navigation_projects[i].forth == false) {
                rightArrow.classList.add("hidden"); // Gestion affichage des flèches de navigation
            } else {
                // Obtention nom du label suivant...
                const nomNextLabel = part1 + (i+2) + part2;
                // ...Pour avoir le temps écoulé entre le début de la timeline et ce label en question (=> Où le label est positionné dans la timeline)  
                const totalTimeNextLabel = tl_scrollTriggerBody.labels[nomNextLabel.toString()];

                rightArrow.addEventListener("click", () => {
                    menuOrArrowClicked = true;
                    gsap.to(window, {duration: duree, scrollTo: {y: (ratio * parseFloat(totalTimeNextLabel)), autoKill: true}, ease: easing, onComplete: () => { menuOrArrowClicked = false } });
                })
            }
            
            i++;
        })
    }


    // Mise en valeur du menu sur lequel on est
    const margeErreurEnPx = 30;
    function setSelectedMenu() {
        for(const d of dataLabelsExceptProjects) {
            //let differenceTime = tl_scrollTriggerBody.totalTime() - d.v; // Ancienne version
            let actualTime = (getScrollTop() / getRatio());
            let differenceTime = actualTime - d.v; // Nvelle version
            document.querySelector(`.link[data-timeline='_${d.v}']`).classList.toggle("selected", (differenceTime < margeErreurEnPx && differenceTime > (margeErreurEnPx * -1)) ? true : false);       
        }
    }

    /// Yeux qui bougent et suivent la souris
    const pupilles = document.querySelectorAll(".pupille");
    const eyesMovingZone = document.querySelector("#eyesMovingZone");
    eyesMovingZone.addEventListener("mousemove", (e) => eyeball(e) );
    function eyeball(event) {
        pupilles.forEach(pupille => {
            // 1. Calcul de l'angle d'orientation des pupilles
            let x = (pupille.getBoundingClientRect().left) + (pupille.getBoundingClientRect().width / 2);
            let y = (pupille.getBoundingClientRect().top) + (pupille.getBoundingClientRect().height / 2);
            let radian = Math.atan2(event.clientX - x, event.clientY - y);
            let rot = (radian * (180 / Math.PI) * -1) + 180;

            // 2. Passage de l'angle en coordonnées x, y dans un rayon de 5
            const movementAmount = 5;
            let angle = (rot - 90) / 180 * Math.PI;  // compensate angle -90°, conv. to rad
            let tx = movementAmount * Math.cos(angle);
            let ty = movementAmount * Math.sin(angle);

            pupille.style.transform = `translate(${tx}px, ${ty}px)`;
        })
    }
    // Yeux qui reviennent à la position initiale qd curseur sort de la zone à l'origine du mvmt des pupilles
    ["mouseleave", "touchend"].forEach(function(e) {
        eyesMovingZone.addEventListener(e, () => { 
            pupilles.forEach(pupille => pupille.style = "");
        });
    });


    // Pour faire apparaitre msg d'incitat° de consultation en mode portrait qd mobile
    function createModalPortraitIsBetter(cookieName) {
        const msgPortraitIsBetterClassList = document.querySelector("#msgPortraitIsBetter").classList;
        const closeModal = () => msgPortraitIsBetterClassList.add("hidden");
        const displayModal = () => msgPortraitIsBetterClassList.remove("hidden");
        let isCookiePresent = () => document.cookie.split(';').some((item) => item.trim().startsWith(`${cookieName}=`));
        
        // Au chargement
        //console.log("isCookiePresent => " + isCookiePresent()); //TEST
        if(isCookiePresent()) closeModal();

        // Si avant rotation mobile, juste click sur bouton 'Fermer', alors on affiche à nouveau l'encart
        window.matchMedia("(orientation: landscape)").onchange = (e) => {    
            //console.log("isCookiePresent => " + isCookiePresent()); //TEST
            if(e.matches && !isCookiePresent()) displayModal();
        };

        // Action boutons
        document.querySelector("#closeModal").addEventListener("click", closeModal);
        document.querySelector("#sessionCloseModal").addEventListener("click", () => {
            document.cookie = `${cookieName}=true`;
            closeModal();
        });
    }


//////////
}());
//////////