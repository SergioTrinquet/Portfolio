//const { src, dest, series, parallel } = require('gulp');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const del = require('del');


const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    imgs: {
        src: 'src/assets/imgs/*.*',
        dest: 'dist/assets/imgs/'
    },
    docs: {
        src: 'src/assets/docs/*.*',
        dest: 'dist/assets/docs/'
    }
};


function clean(cb) {
    return del([ 'dist' ], cb);
}

function generateHtmlFile() {
    return gulp.src(paths.html.src)
        .pipe(useref())
        .pipe(gulpif('*.js', sourcemaps.init()))
        .pipe(gulpif('*.js', uglify()))
        //.pipe(gulpif('*.js',sourcemaps.write('assets/js/maps')))
        .pipe(gulpif('*.js',sourcemaps.write('.')))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest(paths.html.dest));
}

function transfertFiles(directory) {
        return gulp.src(paths[directory].src)
            .pipe(gulp.dest(paths[directory].dest));
}

const transfertImgs = () => transfertFiles("imgs");
const transfertDocs = () => transfertFiles("docs");


const build = gulp.series(clean, gulp.parallel(generateHtmlFile, transfertImgs, transfertDocs));


exports.clean = clean; // pour supprimer le répertoire 'dist': Juste utile en dev.

exports.default = build; // Signifie que même qd on execute simplement la commande 'gulp', cela va executer la fonction 'build'...
exports.build = build;  // ...Mais on peut aussi executer la commande 'gulp build' pour avoir le même résultat