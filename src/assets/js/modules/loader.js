export async function loadSVGfiles() {
    const svgs = [
        { url: 'assets/imgs/svg-animations/portfolio-assets.svg', id: '#SVGs' },
        { url: 'assets/imgs/svg-animations/face-drawing.svg', id: '#SVG-face-drawing' }
    ];

    try {
        await Promise.all(svgs.map(async (svg) => {
            const response = await fetch(svg.url);
            if (!response.ok) throw new Error(`Failed to load ${svg.url}`);
            const text = await response.text();
            const container = document.querySelector(svg.id);
            if (container) {
                container.outerHTML = text;
            }
        }));
    } catch (error) {
        console.error("Erreur lors du chargement des SVG :", error);
    }
}
