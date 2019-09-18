var gulp = require('gulp');
var compress_images = require('compress-images');

// We will be compressing images [jpg] with two algorithms, [webp] and [jpg];
// gulp compress_images
gulp.task('compress_images', function(done) {
    //[jpg] ---to---> [webp]
    compress_images('assets/img/**/*.{jpg,JPG,jpeg,JPEG}', 'assets/img-compressed/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'webp', command: false}},
                                                {png: {engine: false, command: false}},
                                                {svg: {engine: false, command: false}},
                                                {gif: {engine: false, command: false}}, function(err){
            if(err === null){
                //[jpg] ---to---> [jpg(jpegtran)] WARNING!!! autoupdate  - recommended to turn this off, it's not needed here - autoupdate: false
                compress_images('assets/img/**/*.{jpg,JPG,jpeg,JPEG}', 'assets/img-compressed/', {compress_force: false, statistic: true, autoupdate: false}, false,
                                                                {jpg: {engine: 'jpegtran', command: false}},
                                                                {png: {engine: false, command: false}},
                                                                {svg: {engine: false, command: false}},
                                                                {gif: {engine: false, command: false}}, function(){
                });
            }else {
                console.error(err);
            }


    }), done();
});

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpautoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');


// File paths
const files = {
    scssPath: 'assets/scss/*.scss',
    jsPath: 'src/assets/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('assets/css')
    ); // put final CSS in dist folder
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath],
        parallel(scssTask));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask),
    // cacheBustTask,
    watchTask
);
