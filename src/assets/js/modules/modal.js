// Boîtes de dialogue

export function createModalPortraitIsBetter(cookieName) {
    const modal = document.querySelector("#msg-portrait-is-better");
    if (!modal) return;
    
    const msgPortraitIsBetterClassList = modal.classList;
    const closeModal = () => msgPortraitIsBetterClassList.add("hidden");
    const displayModal = () => msgPortraitIsBetterClassList.remove("hidden");
    const isCookiePresent = () => document.cookie.split(';').some((item) => item.trim().startsWith(`${cookieName}=`));
    
    if (isCookiePresent()) closeModal();

    window.matchMedia("(orientation: landscape)").onchange = (e) => {    
        if (e.matches && !isCookiePresent()) displayModal();
    };

    document.querySelector("#close-modal")?.addEventListener("click", closeModal);
    document.querySelector("#session-close-modal")?.addEventListener("click", () => {
        document.cookie = `${cookieName}=true`;
        closeModal();
    });
}
