'use strict';

const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const minify = require("gulp-babel-minify");
const server = require('browser-sync').create();
const mqpacker = require('css-mqpacker');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");

gulp.task('style', function () {
  return gulp.src('css/style.css')
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function () {
  return gulp.src('js/index.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(minify({
      mangle: {
      keepClassName: true
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(rollup({}, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('imagemin', ['copy'], function () {
  return gulp.src('build/img/**/*.{jpg,png,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});


gulp.task('copy-html', function () {
  return gulp.src('*.{html,ico}')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('copy', ['copy-html', 'scripts', 'style'], function () {
  return gulp.src([
    'fonts/**/*.{woff,woff2}',
    'img/*.*'
  ], {base: '.'})
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('js-watch', ['scripts'], function (done) {
  server.reload();
  done();
});

gulp.task('serve', ['assemble'], function () {
  server.init({
    server: './build',
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch('css/**/*.css', ['style']);
  gulp.watch('*.html').on('change', (e) => {
    if (e.type !== 'deleted') {
      gulp.start('copy-html');
    }
  });
  gulp.watch('js/**/*.js', ['js-watch']);
});

gulp.task('assemble', ['clean'], function () {
  gulp.start('copy', 'style');
});

gulp.task('build', ['assemble', 'imagemin']);
