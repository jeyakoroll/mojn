const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const pump = require('pump');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concatCss = require('gulp-concat-css');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const path_js_files = [
    './source/js/main.js'
];

const path_css_files = [
    './source/css/main.scss'
]

gulp.task('dev_compress_js', function (cb) {
  pump([
        gulp.src( path_js_files ),
        sourcemaps.init(),
        // uglify({'mangle': false}),
        concat('main.min.js'),
        sourcemaps.write(),
        gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('prod_compress_js', function (cb) {
  pump([
        gulp.src( path_js_files ),
        uglify({'mangle': false}),
        concat('main.min.js'),
        gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('dev_concat_css', function () {
    return gulp.src(path_css_files)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(concatCss("all.min.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('prod_minify_css', function () {
    gulp.src(path_css_files)
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss("all.min.css"))
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir:'./'
        }
    });
});
gulp.watch(path_js_files,[ 'dev_compress_js']).on('change', function(){
    setTimeout(function(){
        browserSync.reload();
    },200);
});
gulp.watch(path_css_files,[ 'dev_concat_css']).on('change', function(){
    setTimeout(function(){
        browserSync.reload();
    },200);
});


gulp.task('dev', ['dev_compress_js', 'dev_concat_css', 'browser-sync']);
gulp.task('production', ['prod_compress_js', 'prod_minify_css']);
