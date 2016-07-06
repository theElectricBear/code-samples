const   gulp = require('gulp');

const   jshint = require('gulp-jshint'),
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        scsslint = require('gulp-scss-lint'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        autoprefixer = require('gulp-autoprefixer'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        iconify = require('gulp-iconify'),
        sourcemaps = require('gulp-sourcemaps'),
        uncss = require('gulp-uncss'),
        babel = require('gulp-babel'),
        webpack = require('webpack-stream');


gulp.task('scss-lint', () => {
    return gulp.src('scss/*.scss')
      .pipe(scsslint());
});


// Compile Other Sass
gulp.task('sass', () => {
    return gulp.src('scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 2 version', 'ie 9', 'Android 4.2', 'Android 4.3', 'IoS 6'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())

        .pipe(gulp.dest("./build/css"));
});
//Run Webpack
gulp.task('webpack', () => {
  return gulp.src('js/main.js')
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('build/js/'));
});

// Transpile ES6
gulp.task('scripts', () => {
    return gulp.src(['./js/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

//Image Optimization
gulp.task('optimizeImages', () => {
    return gulp.src('./images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/images/'));
});

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch('./js/**/*.js', ['webpack']);
    gulp.watch('./scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'webpack', 'optimizeImages', 'watch']);