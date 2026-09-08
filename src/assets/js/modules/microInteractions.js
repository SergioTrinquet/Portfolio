// Petites animations

import { dom } from './state.js';

export function initJobTitleAnimation() {
    if (!dom.intituleJob) return;
    dom.intituleJob.innerHTML = dom.intituleJob.innerText.split("").map((char, i) =>
        `<span style="transform:rotate(${(i * 6.5) - 80}deg) translateZ(0);">${char}</span>`
    ).join("");
}

export function initEyeballTracking() {
    if (!dom.eyesMovingZone) return;
    
    dom.eyesMovingZone.addEventListener("mousemove", (e) => eyeball(e));

    function eyeball(event) {
        dom.pupilles.forEach(pupille => {
            const x = (pupille.getBoundingClientRect().left) + (pupille.getBoundingClientRect().width / 2);
            const y = (pupille.getBoundingClientRect().top) + (pupille.getBoundingClientRect().height / 2);
            const radian = Math.atan2(event.clientX - x, event.clientY - y);
            const rot = (radian * (180 / Math.PI) * -1) + 180;

            const movementAmount = 5;
            const angle = (rot - 90) / 180 * Math.PI;
            const tx = movementAmount * Math.cos(angle);
            const ty = movementAmount * Math.sin(angle);

            pupille.style.transform = `translate(${tx}px, ${ty}px)`;
        });
    }

    ["mouseleave", "touchend"].forEach(function(e) {
        dom.eyesMovingZone.addEventListener(e, () => { 
            dom.pupilles.forEach(pupille => pupille.style = "");
        });
    });
}
