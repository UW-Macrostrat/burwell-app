var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css');

gulp.task('default', function() {
  gulp.src(['js/zepto.min.js', 'js/fastclick.min.js', 'js/leaflet.js', 'js/leaflet-hash.js', 'js/mustache.min.js'])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));

  gulp.src(['css/leaflet.css'])
    .pipe(concat('leaflet.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css/'))
});

