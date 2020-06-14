const gulp = require('gulp'); //модуль gulp
const sass = require('gulp-sass');//модуль для обробки sass файлів
const autoprefixer = require('gulp-autoprefixer');//для кросбраузерності
const cssnano = require('gulp-cssnano');//для мініфікації css файлів
const image = require('gulp-image');//для мініфікації картинок
const rename = require("gulp-rename");//для зміни назви файлів
const uglify = require('gulp-uglify-es').default;//для мініфікації js файлів
const browserSync = require('browser-sync').create();//для запусну сервера з власним портом
const concat = require('gulp-concat');//для конкатикації файлів
const del = require('del');//для видалення файлів
const fonter = require('gulp-fonter'); //Білд шрифтів

//шляхи до файлів
const paths = {
    images: {
        src: 'app/images/**/*.*',
        dest: 'build/images'
    },
    styles: {
        style:{
            src: 'app/styles/**/*.scss',
            dest: 'build/css'
        },
        fonts:{
            src: 'app/styles/base/fonts/**/*.{ttf,otf}',
            dest: 'build/css/fonts'  
        }
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    }
};
//запускає локальний хост з власним портом
function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3002
    });
    done();
};
 //при зміні в файлах перезагружати сторінку
function browserReload(done) {
    browserSync.reload();
    done();
};
//всі картинки міміфікуються | .pipe() - метод який запускає різні модулі | image() - сам модуль
function images(){
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream())
};
//Білд шрифтів
function fonts(){
    return gulp.src(paths.styles.fonts.src)
        .pipe(fonter())
        .pipe(gulp.dest(paths.styles.fonts.dest))
        .pipe(browserSync.stream())
};
//обробка css файлів
function styles(){
    return gulp.src(paths.styles.style.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.style.dest))
        .pipe(browserSync.stream())
};
//обробка js файлів
function scripts(){
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
};
//Білд html файлу
function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
};
// при зміні в файлах запускати ф-ції
function watch(){
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.styles.style.src, styles);
    gulp.watch(paths.styles.fonts.src, fonts);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch('./app/*.html', gulp.series(browserReload));
};
//ф-ція видаляє /build
function clear(){
    return del(['build']);
}
    
// const build = gulp.series(clear, gulp.parallel(images, styles, fonts, scripts, html), watch);
// // let loadd = gulp.series(gulp.parallel(watch, build), browser);
// gulp.task('build', build);
// // gulp.task('building', gulp.parallel(watch, build));
// gulp.task('default', browser);

const build = gulp.series(clear, gulp.parallel(images, fonts, styles, scripts, html));
gulp.task('build', build);
gulp.task('default', gulp.parallel(watch, gulp.series(build, browser) ));