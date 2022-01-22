const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');

const clean = () => {
  return del('build');
};
exports.clean = clean;

const copy = () => {
  return gulp.src([
              'app/fonts/**/*.{woff, woff2}',
              'app/img/**',
              'app/js/**',
              'app/*.ico'
            ], {
              base: 'app'
            })
             .pipe(gulp.dest('build'));
};
exports.copy = copy;

const images = () => {
  return gulp.src('app/img/**/*.{jpg,png,svg}')
             .pipe(imagemin([
               imagemin.optipng({optimizationLevel: 3}),
               imagemin.jpegtran({progressive: true}),
               imagemin.svgo()
             ]));
};
exports.images = images;

const webpimg = () => {
  return gulp.src('app/img/**/*.{jpg,png}')
             .pipe(webp({quality: 90}))
             .pipe(gulp.dest('app/img'));
};
exports.webpimg = webpimg;

const sprite = () => {
  return gulp.src('app/img/**/icon-*.svg')
             .pipe(svgstore())
             .pipe(rename(sprite.svg))
             .pipe(gulp.dest('app/img'));
};
exports.sprite = sprite;

const styles = () => {
  return gulp.src('app/scss/style.scss')
             .pipe(plumber())
             .pipe(sourcemap.init())
             .pipe(sass())
             .pipe(postcss([
               autoprefixer()
              ]))
             .pipe(csso())
             .pipe(rename('style.min.css'))
             .pipe(sourcemap.write('.'))
             .pipe(gulp.dest('app/css'))
             .pipe(sync.stream());
};
exports.styles = styles;

const css = () => {
  return gulp
    .src("app/css/*.css", {
      base: "app",
    })
    .pipe(gulp.dest("build"));
};
exports.css = css;

const html = () => {
  return gulp
    .src("app/*.html")
    .pipe(gulp.dest("build"));
};
exports.html = html;

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'app'
    },
    cors: true,
    notify: false,
    ui: false
  });
  done();
};
exports.server = server;

const build = gulp.series(
  clean, copy, styles, css, html
);
exports.build = build;

const watcher = () => {
  gulp.watch('app/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('app/*.html').on('change', sync.reload);
};

exports.default = gulp.series(
  styles, server, watcher
);