const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();

const styles = () => {
  return gulp.src('app/scss/style.scss')
             .pipe(plumber())
             .pipe(sourcemap.init())
             .pipe(sass())
             .pipe(postcss([
               autoprefixer()
              ]))
             .pipe(sourcemap.write('.'))
             .pipe(gulp.dest('app/css'))
             .pipe(sync.stream());
};
exports.styles = styles;

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

const watcher = () => {
  gulp.watch('app/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('app/*.html').on('change', sync.reload);
};

exports.default = gulp.series(
  styles, server, watcher
);