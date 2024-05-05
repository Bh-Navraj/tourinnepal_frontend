const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Using Dart Sass
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');

const stylesSource = './resources/scss/**/*.scss';
const stylesDestination = './assets/css';
const jsVendorSource = [   
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', // Example: Bootstrap
];
const jsVendorDestination = './assets/js';
const jsVendorFile = 'vendor';

const jsCustomSource = './resources/js/custom/*.js';
const jsCustomDestination = './assets/js';
const jsCustomFile = 'main';

function compileMinifiedStyles() {
    return src(stylesSource)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(
            sass({
                includePaths: ['node_modules/bootstrap/scss/'],
            }).on('error', sass.logError) // Error handling for Sass compilation
        )
        .pipe(postcss([autoprefixer, cssnano({ preset: ['default', { calc: false }] })]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(stylesDestination))
        .pipe(notify({ message: 'TASK: "styles" Completed! 💯', onLast: true }));
}

function compileUnminifiedStyles() {
    return src(stylesSource)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                includePaths: ['node_modules/bootstrap/scss/'],
                outputStyle: 'expanded',
            }).on('error', sass.logError) // Error handling for Sass compilation
        )
        .pipe(postcss([autoprefixer]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(stylesDestination))
        .pipe(notify({ message: 'TASK: "styles" Completed! 💯', onLast: true }));
}

/*Compile Files in js/vendor intended for vendor scripts example bootstrap, meanmenu, etc*/
function compileVendorJS() {
    return src(jsVendorSource)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(concat(jsVendorFile + '.js'))
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                        },
                    ],
                ],
            })
        )
        .pipe(dest(jsVendorDestination))
        .pipe(
            rename({
                basename: jsVendorFile,
                suffix: '.min',
            })
        )
        .pipe(uglify())
        .pipe(dest(jsVendorDestination))
        .pipe(notify({ message: 'TASK: "compileVendorJS" Completed! 💯', onLast: true }));
}

/*Compile Files in Custom JS intended for non-vendor scripts*/
function compileCustomJS() {
    return src(jsCustomSource)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                        },
                    ],
                ],
            })
        )
        .pipe(dest(jsCustomDestination))
        .pipe(
            rename({
                basename: jsCustomFile,
                suffix: '.min',
            })
        )
        .pipe(uglify())
        .pipe(dest(jsCustomDestination))
        .pipe(notify({ message: 'TASK: "compileCustomJS" Completed! 💯', onLast: true }));
}

exports.compileVendorJS = compileVendorJS;
exports.compileCustomJS = compileCustomJS;
exports.default = parallel(compileUnminifiedStyles, compileMinifiedStyles, compileVendorJS, compileCustomJS, (done) => {
    watch(stylesSource, parallel(compileUnminifiedStyles, compileMinifiedStyles));
    watch(jsVendorSource, compileVendorJS);
    watch(jsCustomSource, compileCustomJS);
    done();
});