'use strict';

var babelify = require('babelify');
var babelRegister = require('babel-register');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var config = {
    environment: 'production',
    development: {
        minify: false,
        sourcemaps: true
    },
    production: {
        minify: true,
        sourcemaps: false
    },
    scripts: {
        destDirectory: './dist',
        destFileName: 'tapSquire.js',
        source: './src/scripts/tapSquire.js'
    },
    tests: {
        source: './tests/*.js'
    }
};

process.env.NODE_ENV = config.environment;

gulp.task('default', ['build']);

gulp.task('build', ['test:scripts', 'compile:scripts'], () => {
    return;
});

gulp.task('clean:scripts', () => {
    return del(config.scripts.destDirectory);
});

gulp.task('compile:scripts', ['clean:scripts', 'lint'], () => {
    return browserify(config.scripts.source, { 
            debug: config[config.environment].sourcemaps,
            standalone: 'TapSquire',
            transform: babelify
        })
        .bundle()
        .on('error', (error) => { 
            console.log('Error: ' + error.message); 
        })
        .pipe(source(config.scripts.destFileName))
        .pipe(buffer())
        .pipe(gulp.dest(config.scripts.destDirectory))
        
        // Minify
        .pipe(gulpif(config[config.environment].minify, uglify()))
        .pipe(gulpif(config[config.environment].minify, rename({suffix: '.min'})))
        .pipe(gulp.dest(config.scripts.destDirectory));
});

gulp.task('lint', () => {
    return gulp.src(['./src/scripts/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test:scripts', function () {
	return gulp.src(config.tests.source)
		.pipe(mocha({
            compilers: {
                js: babelRegister
            },
            reporter: 'nyan'
        }));
});