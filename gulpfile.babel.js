// Modo Desarrollo
const devMode = false

// Common
import gulp from 'gulp'
import concat from 'gulp-concat'

// HTML
import pug from 'gulp-pug'

// CSS
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import comments from 'postcss-discard-comments'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import purgecss from 'gulp-purgecss'
const critical = require('critical').stream

// JavaScript
import babel from 'gulp-babel'
import terser from 'gulp-terser'

// IMG
import imagemin from 'gulp-imagemin'

// Google Fonts
import googleWebFonts from 'gulp-google-webfonts'

// Browser Sync
import { init as server, stream, reload } from 'browser-sync'

gulp.task('html', () => {
  return gulp
    .src('src/views/pages/**/*.pug')
    .pipe(pug({ pretty: devMode }))
    .pipe(gulp.dest('docs'))
})

const filesJs = [
  'src/js/lib/jquery-3.3.1.slim.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'src/js/cookies-control.js',
  'src/js/scroll-behavior-smooth.js',
  'src/js/scroll-shot.js',
  'src/js/scroll-show.js',
  'src/js/lazy-load.js',
  'src/js/custom.js',
]

gulp.task('js', () => {
  if (devMode) {
    return gulp
      .src(filesJs)
      .pipe(concat('scripts.js'))
      .pipe(gulp.src('src/js/smooth-scroll.min.js'))
      .pipe(gulp.dest('docs/js'))
  } else {
    return gulp
      .src(filesJs)
      .pipe(babel())
      .pipe(concat('scripts.js'))
      .pipe(gulp.src('src/js/smooth-scroll.min.js'))
      .pipe(terser())
      .pipe(gulp.dest('docs/js'))
  }
})

gulp.task('css', () => {
  if (devMode) {
    return gulp
      .src('src/scss/styles.scss')
      .pipe(sass())
      .pipe(gulp.dest('docs/css'))
      .pipe(stream())
  } else {
    return gulp
      .src('src/scss/styles.scss')
      .pipe(sass())
      .pipe(
        purgecss({
          content: ['docs/**/*.html', 'docs/js/*.js'],
          variables: true,
        })
      )
      .pipe(postcss([comments({ removeAll: true }), cssnano(), autoprefixer()]))
      .pipe(gulp.dest('docs/css'))
      .pipe(stream())
  }
})

gulp.task('critical', () => {
  return gulp
    .src('docs/*.html')
    .pipe(
      critical({
        base: 'docs/',
        inline: true,
        css: ['docs/css/styles.css'],
        ignore: ['font-face'],
      })
    )
    .pipe(gulp.dest('docs'))
})

gulp.task('img', () => {
  return gulp
    .src('src/img/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 70, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest('docs/img'))
})

gulp.task('rest', () => {
  return (
    gulp
      .src('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-*.*')
      .pipe(gulp.dest('docs/fonts')),
    gulp.src(['src/*.*', 'src/.*']).pipe(gulp.dest('docs'))
  )
})

gulp.task('gfonts', () => {
  return gulp
    .src('fonts.list')
    .pipe(googleWebFonts({ fontDisplayType: 'swap' }))
    .pipe(gulp.dest('docs/gfonts'))
})

gulp.task('all', gulp.series('html', 'js', 'css', 'critical', 'img', 'rest'))

gulp.task('html5', gulp.series('html', 'js', 'css', 'critical'))

gulp.task('default', () => {
  server({
    server: 'docs',
  })
  gulp.watch('src/views/**/*.pug', gulp.series('html', reload))
  gulp.watch('src/js/**/*.js', gulp.series('js', reload))
  gulp.watch('src/scss/**/*.scss', gulp.series('css'))
})
