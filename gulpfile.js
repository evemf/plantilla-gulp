var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    purgeSourcemaps = require('gulp-purge-sourcemaps'),
    sassGlob = require('gulp-sass-glob'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    browserSync = require("browser-sync").create();


  //Sincronización de pantallas
  gulp.task('browser-sync', function() {
      browserSync.init({
          server: {
              baseDir: './build/',
              directory: true
          },
          notify: {
              styles: {
                  top: '0',
                  right: '0'
              }
          },
          injectChanges: true
      });

  });

  //Console if brwosersync is init
  browserSync.emitter.on("init", function () {
    console.log("Browsersync is running!");
  });

  //Refrescar pantalla
  gulp.task("bs-reload", function() {
      browserSync.reload();
  });

  /*templates*/
  gulp.task('templates', function() {
    gulp.src('./src/templates/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./build/'))
  });

  /*styles*/
  gulp.task('styles', function () {
    gulp.src('./src/scss/**/*.scss')
    //remove sourcemaps for delivering the project,
    //do not add into the minified file
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    //remove sourcemaps for delivering the project,
    // //do not add into the minified file
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
  });

  /*scripts*/
  gulp.task('scripts', function () {
    return gulp.src([
      'src/js/**/functions.js',
      'src/js/**/*.js'
    ])
    .pipe(gulp.dest('./build/js'))
  });


  /*libraries*/
  gulp.task('libs-js', function () {
    return gulp.src([
      'src/libs/jquery-*.js',
      'src/libs/**/*.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./build/libs'))
  });

  gulp.task('libs-css', function () {
    return gulp.src([
      'src/libs/**/*.css'
    ])
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('./build/libs'))
  });

  gulp.task('remove-dist-folder', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
  });

  /*create dist folder*/
  gulp.task('dist', function () {

    var buildHTML = gulp.src([
      'build/**/*.html'
    ])
    .pipe(gulp.dest('./dist/'));

    var distCSS = gulp.src([
      'build/css/**/*.css'
    ])
    //we remove sourcemaps
    .pipe(purgeSourcemaps())
    .pipe(cssnano({reduceIdents: false}))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./dist/css/'));

    var distJS = gulp.src([
      'build/js/**/functions.js',
      'build/js/**/*.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./dist/js'));

    var distLIBScss = gulp.src([
      'build/libs/**/*.css'
    ])
    .pipe(purgeSourcemaps())
    .pipe(cssnano())
    .pipe(concat('libs.min.css'))
    .pipe(gulp.dest('./dist/libs'));

    var distLIBSjs = gulp.src([
      'build/libs/**/*.js'
    ])
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('./dist/libs'))

    return [buildHTML, distCSS, distJS, distLIBScss, distLIBSjs];
  });



gulp.task('default', ['templates', 'browser-sync', 'styles', 'scripts', 'libs-js', 'libs-css', 'remove-dist-folder'] , function() {
  gulp.watch('src/**/*.jade', ['templates', 'bs-reload']);
  gulp.watch('src/scss/**/*.scss', ['styles', 'bs-reload']);
  gulp.watch('src/js/*.js', ['scripts', 'bs-reload']);
  gulp.watch('src/libs/*.js', ['libs-js', 'bs-reload']);
  gulp.watch('src/libs/*.css', ['libs-css', 'bs-reload']);
});
