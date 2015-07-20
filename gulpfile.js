var gulp = require('gulp'),
    htmlhint = require('gulp-htmlhint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream');

gulp.task('build', function() {
  gulp.src('./index.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());

  gulp.src(['node_modules/leaflet/dist/leaflet.js', 'node_modules/leaflet-hash/leaflet-hash.js', 'js/leaflet-panToOffset.js'])
    .pipe(concat('leaflet-all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
});

gulp.task('css-min', function() {
  gulp.src(['node_modules/leaflet/dist/leaflet.css', 'css/map.css'])
    .pipe(concat('styles.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css/'));
})

gulp.task('watch', function() {
    gulp.watch('js/components/*.jsx', ['browserify-babel']);
    gulp.watch('js/**/*.jsx', ['browserify-babel']);
    gulp.watch('css/*.css', ['css-min']);
    gulp.watch('index.html', ['build']);
});

gulp.task('browserify-babel', function() {
  browserify({
    entries: 'js/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./build'))

});

gulp.task('default', ['build', 'css-min', 'browserify-babel']);
