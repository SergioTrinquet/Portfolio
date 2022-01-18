//const { src, dest, series, parallel } = require('gulp');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const useref = require('gulp-useref');
const del = require('del');

const paths = {
    styles: {
      src: 'src/css/*.css',
      dest: 'dist/css/'
    },
    scripts: {
      src: 'src/js/*.js',
      dest: 'dist/js/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    imgs: {
        src: 'src/imgs/*.*',
        dest: 'dist/imgs/'
    }
  };


function clean(cb) {
    return del([ 'dist' ], cb);
}

function generateHtmlFile() {
    return gulp.src(paths.html.src)
        .pipe(useref())
        .pipe(gulp.dest(paths.html.dest));
}

function generateJsFile() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function generateCSSFile() {
    return gulp.src(paths.styles.src)
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
        basename: 'styles',
        suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function transfertImgs() {
    return gulp.src(paths.imgs.src)
        .pipe(gulp.dest(paths.imgs.dest));
}


const build = gulp.series(clean, gulp.parallel(generateHtmlFile, generateJsFile, generateCSSFile, transfertImgs));

exports.clean = clean; // pour supprimer le répertoire 'dist': Juste utile en dev.

exports.default = build; // Signifie que même qd on execute simplement la commande 'gulp', cela va executer la fonction 'build'...
exports.build = build;  // ...Mais on peut aussi executer la commande 'gulp build' pour avoir le même résultat