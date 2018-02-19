'use strict';

const gulp = require('gulp'),
	  del = require('del'),
	  tsc = require('gulp-typescript'),
	  tsProject = tsc.createProject('tsconfig.json'),
	  ngAnnotate = require('gulp-ng-annotate'),
	  uglify = require('gulp-uglify'),
	  sourcemaps = require('gulp-sourcemaps'),
	  runSequence = require('run-sequence'),
      sass = require("gulp-sass"),
      minifycss = require('gulp-minify-css'),
      htmlmin = require('gulp-htmlmin'),
	  systemjsBuilder = require('systemjs-builder'),
      rename = require('gulp-rename');

gulp.task('clean', () => {
	return del('dist');
});


gulp.task('build:client', () => {
    var tsProject = tsc.createProject('tsconfig.json');
    var tsResult = gulp.src('app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist/app'));
});

gulp.task('bundle:app', () => {
	var builder = new systemjsBuilder('','./systemjs.config.js');
	return builder.buildStatic('app','dist/main.js');
});

gulp.task("sass", function () {
    gulp.src("app/**/*.scss")
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/app'));
});

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('minify:js', function() {
  return gulp
    .src('dist/main.js')
    .pipe(uglify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ()=>{
	runSequence('clean', 'sass','build:client', 'bundle:app', 'minify:js');	
});

gulp.task('default', ['build']);