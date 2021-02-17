const gulp = require('gulp'); // gulp module
const scss = require('gulp-sass'); // sass/scss files processing
const autoprefixer = require('gulp-autoprefixer'); // crossbrowser
const cssnano = require('gulp-cssnano'); // minify .css files
const imagemin = require('gulp-imagemin'); // compression images
const uglify = require('gulp-uglify-es').default;// minify .js files
const browserSync = require('browser-sync').create(); // run server
const concat = require('gulp-concat'); // concatination files
const del = require('del'); // delete files
const fonter = require('gulp-fonter'); // fonts processing
const paths = require('./gulp.paths');


// ** run localhoct with its own port **
function browser(done) {
    browserSync.init({
        server: {
            baseDir: './docs'
        },
        port: 3002
    });
    done();
};

// ** reload page if files have changed **
function browserReload(done) {
    browserSync.reload();
    done();
};

// ** compression media files **
function images(){
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream())
};

// ** fonts processing **
function fonts(){
    return gulp.src(paths.fonts.src)
        .pipe(fonter())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream())
};

// ** processing .scss files **
function styles(){
    return gulp.src(paths.styles.src)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({ 
                cascade: false
        }))
        .pipe(concat(`main.min.css`))
        .pipe(cssnano())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
};

// ** processing .js files **
function scripts(){
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
};

// ** .html processing **
function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
};

// ** observation files **
function watch(){
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch('./src/*.html', gulp.series(browserReload));
};

// delete folder 'docs'
function clear(){
    return del(['dosc']);
};

const build = gulp.series(clear, gulp.parallel(images, fonts, styles, scripts, html));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, gulp.series(build, browser)));