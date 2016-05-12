//set working directory ***ToDo: use watch to find directory of changed items
var currentDirectory = 'AppleSpring2016';

var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    combinemq = require('gulp-combine-mq'),
    minifyCSS = require('gulp-minify-css'),
    scsslint = require('gulp-scss-lint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    iconify = require('gulp-iconify'),
    sourcemaps = require('gulp-sourcemaps');
uncss = require('gulp-uncss');
pngquant = require('imagemin-pngquant')


//ToDo: Configure correctly to create icons for Explore
gulp.task('iconify', function () {
    iconify({
        src: ['images/icons_used/*.svg'],
        scssOutput: 'sass/icons/',
        cssOutput: 'css/icons/'
    });
});

//If you get an erro when this task runs try running:
//gem install scss_lint
// this gulp plugin will require you to have Ruby installed
gulp.task('scss-lint', function () {
    return gulp.src(currentDirectory + '/sass/*.scss')
      .pipe(scsslint());
});
// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src(currentDirectory + '/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            errLogToConsole: true
        }))
    //.pipe(combinemq()) ***ToDo: removed due to errors need to resolve
        .pipe(autoprefixer('last 2 version', 'ie 9', 'Android 4.2', 'Android 4.3', 'IoS 6'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCSS())

        .pipe(gulp.dest(currentDirectory + "/styles"));
});


// Concatenate & Minify JS  ToDo: Throws unhandled event error

//***for the time being manually add the folder you are working in
gulp.task('scripts', function () {
    return gulp.src([currentDirectory + '/scripts/**/*.js', '!' + currentDirectory + '/scripts/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(currentDirectory + '/scripts'));
});

gulp.task('dev-scripts', function () {
    return gulp.src(['scripts/development/**/*.js', '!scripts/development/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('scripts'));
});

gulp.task('telesales-squish', function () {
    return gulp.src(['telesales/scripts/full.js', '!telesales/scripts/full.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('telesales/scripts'));
});
//Image Optimization
gulp.task('optimizeImages', function () {
    return gulp.src(currentDirectory + '/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(currentDirectory + '/images/'));
});
// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch([currentDirectory + '/scripts/**/*.js', '!' + currentDirectory + '/scripts/**/*.min.js']['scripts']);
    gulp.watch(currentDirectory + '/sass/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'optimizeImages', 'watch']);
