const gulp = require('gulp');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean-dest');
const path = require('path');
const del = require('del');
const gpug = require('gulp-pug');
const jsdoc = require('gulp-jsdoc3');
const zip = require('gulp-zip');
const fs = require('fs');
const grepl = require('gulp-replace');
const guglify = require('gulp-uglify');
const pump = require('pump');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const LessCleanCSS = require('less-plugin-clean-css');
const gexec = require('child_process').exec;
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');

const less_autoprefix = new LessAutoprefix({
    advanced: true
});
const less_clean = new LessCleanCSS({
    browsers: ['last 10 versions']
});

// Chrome extension manifest
const extman = require('./src/manifest.json');
// Vars
const vars = require('./vars.json');

// Drop build dir.
gulp.task('clean', function () {
	return del(['./temp/']);
});

// Validate sources with auto-fixes
gulp.task('eslint', function () {
	return gulp.src(['./src/_js/**/*.js'])
	.pipe(eslint({
			useEslintrc: true,
			fix: true
		}))
	.pipe(eslint.format())
	.pipe(eslint.results(function (results) {
			// console.log("ESList. Total Warnings: " + results.warningCount + " Total Errors: " + results.errorCount);
		}));
});

// Compile LESSto CSS
gulp.task('css', function () {
	return gulp.src('./src/_less/*.less')
	.pipe(clean('temp/css/'))
	.pipe(less({
			plugins: [less_clean, less_autoprefix]
		}))
	.pipe(gulp.dest('./temp/css/'));
});

// Compile PUG templates
gulp.task('html', function () {
	return gulp.src('./src/_pug/*.pug')
	.pipe(clean('./temp/html/'))
	.pipe(gpug({
			doctype: 'html',
			pretty: true
		}))
	.pipe(gulp.dest('./temp/html/'));
});

// Compile Babel JS to normal
gulp.task('js_babel', function () {
	return gulp.src('./src/_js/**/*.js')
	.pipe(clean('./temp/_js/'))
	.pipe(babel({
			presets: ['env']
		}))
	.pipe(gulp.dest('./temp/_js/'));
});

// Browserify compiled babel
gulp.task('js_browserify', function () {
	return gulp.src('./temp/_js/*.js')
	.pipe(clean('./temp/js/'))
	.pipe(browserify({
			insertGlobals: true
		}))
	.pipe(gulp.dest('./temp/js/'));
});

// Drop temp folder where compiled babel is located
gulp.task('js_drop_temp', function () {
	return del(['temp/_js/']);
});

// Minify compiled-browserified Babel
gulp.task('js_uglify', function (cb) {
	pump([
			gulp.src('./temp/js/*.js'),
            guglify({
				compress: {
					dead_code: false,
					unused: false
				}
			}),
			gulp.dest('./temp/js/')
		],
		cb);
});

// Full JS job
gulp.task('js', gulp.series('js_babel', 'js_browserify', 'js_uglify', 'js_drop_temp'));


gulp.task('assets', function () {
	return gulp.src(['./src/_locales/**/*', './src/icon/**/*', './src/sound/**/*', './src/*.md', './src/*.json'], { base: './src/' })
	.pipe(gulp.dest('./temp/'));
});

// Full compile job
gulp.task('compile', gulp.series('clean', 'js', 'css', 'html', 'assets'));


// ZIP contents
gulp.task('zip', function () {
	return gulp.src('./temp/**/*')
	.pipe(clean('./build/'))
	.pipe(zip('ext.zip'))
	.pipe(gulp.dest('./build/'));
});

// Generate documentation
gulp.task('docs', function () {
	return gulp.src('./src/_js/*.js')
	.pipe(jsdoc(require('./jsdoc.json'), function done() {
        return gulp.src('./docs/**/*.html')
            .pipe(grepl('{{TITLE}}', vars.EXT_TITLE))
            .pipe(grepl('{{VERSION}}', extman.version))
            .pipe(grepl('{{EXT_REPO}}', vars.EXT_REPO));
	}));
});

gulp.task('ffsign', function (cb) {
    if (vars.FFSign.use === true) {
        return false;
    }
    
    gexec('.\\node_modules\\.bin\\web-ext sign --api-key '+vars.FFSign.USERID+' --api-secret '+vars.FFSign.SECRETKEY+' --source-dir=./temp/ --artifacts-dir=./build/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', function () {
	// This will only run if the lint task is successful...
});
