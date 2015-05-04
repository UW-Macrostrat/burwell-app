var gulp = require('gulp'),
    htmlhint = require('gulp-htmlhint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css');

gulp.task('default', function() {
  gulp.src('./index.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());

  gulp.src(['js/map.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  gulp.src(['js/zepto.min.js', 'js/fastclick.min.js', 'js/leaflet.js', 'js/leaflet-hash.js', 'js/mustache.min.js'])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));

  gulp.src(['css/leaflet.css', 'css/map.css'])
    .pipe(concat('styles.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css/'))
});

