# Project Instructions: Portfolio (GSAP Animation)

## Project Overview
This project is a personal portfolio website designed with a focus on high-quality animations using the **GSAP (GreenSock Animation Platform)** library. It is a front-end project built with vanilla web technologies (HTML, CSS, JavaScript) and utilizes **Gulp** as a task runner for build automation.

### Core Technologies
- **GSAP (v3.9.1):** Primary engine for complex timeline-based animations and scroll-triggered effects (`ScrollTrigger`, `ScrollToPlugin`).
- **Vivus.js:** Used for SVG path animations (outline drawing).
- **Gulp:** Handles building the production-ready `dist` folder (minification, concatenation, sourcemaps).
- **Vanilla CSS:** Custom styling with heavy use of CSS variables for theming and animation offsets.

### Architecture
- **Source Files (`src/`):** Contains the development files.
  - `assets/js/portfolio.js`: Main application logic, encapsulated in an IIFE, managing animations and scroll behavior.
  - `assets/css/styles.css`: Main stylesheet using a fixed-position layout for parallax and screen-transition effects.
- **Build Output (`dist/`):** Auto-generated directory containing minified and bundled files for deployment.

---

## Building and Running

### Development
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Build:**
    ```bash
    npm run build
    ```
    *Note: This executes `gulp`, which cleans the `dist` folder and regenerates all assets.*

### Deployment
- The project is configured for deployment on **Vercel**.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## Development Conventions

### Animation Patterns (GSAP)
- **Timeline Management:** Most animations are coordinated using GSAP timelines.
- **ScrollTrigger:** Used extensively to trigger animations based on vertical scroll progress.
- **Mobile Optimization:** Special handling for mobile/tablet browsers to fix `vh` unit inconsistencies caused by the browser's address bar.

### Coding Style
- **Encapsulation:** JavaScript logic in `portfolio.js` is wrapped in an IIFE to prevent global namespace pollution.
- **Resource Loading:** Scripts are loaded with `defer` to ensure the DOM is ready without blocking initial paint.
- **Responsive Design:** Uses a mobile-first approach with specific modal warnings for portrait/landscape orientation on mobile devices.

### Maintenance
- **Adding Projects:** New project showcases are likely added via HTML structure in `src/index.html` and styled in `src/assets/css/styles.css`.
- **Modifying Animations:** Update the GSAP timelines in `src/assets/js/portfolio.js`.

---

## Key Files Summary
- `gulpfile.js`: Build configuration using `gulp-useref`, `gulp-uglify`, and `gulp-clean-css`.
- `src/index.html`: Main entry point with `useref` blocks for bundling.
- `src/assets/js/portfolio.js`: The heart of the portfolio's interactivity.
- `src/assets/css/styles.css`: Defines the visual structure and layout of the "screens".
 
 ---

 ## Instructions à suivre quand Gemini CLI doit modifier le code

Avant de proposer des modifications concernant les animations et/ou du code utilisant GSAP :

1. Consulte la documentation officielle :
   https://gsap.com/docs/

   et spécialememt la documentation pour les 2 plugins utilisés dans ce projet à savoir `ScrollTrigger` et `ScrollToPlugin` :
   https://gsap.com/docs/v3/Plugins/ScrollTrigger/
   https://gsap.com/docs/v3/Plugins/ScrollToPlugin

2. Vérifie que les API utilisées sont valides pour la  GSAP v3.9.1.

3. Si un doute existe, privilégie la documentation officielle
   plutôt que tes connaissances internes.