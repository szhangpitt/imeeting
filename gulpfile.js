var gulp = require('gulp'), 
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	livereload = require('gulp-livereload');

var libSources = ['components/lib/sugar.min.js', 
				  'components/lib/angular.min.js', 
				  'components/lib/angular-route.js', 
				  'components/lib/jquery-1.10.1.min.js', 
				  'components/lib/jquery-ui-1.10.3.custom.min.js']

var jsSources = ['components/scripts/think.js',
			  'components/scripts/speech.js', 
			  'components/scripts/data.js',
			  'components/scripts/ui.js'];

var sassSources = ['components/sass/*.scss'];

gulp.task('lib', function(){
	gulp.src(libSources)
		.pipe(uglify())
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('js'));
});

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(uglify())
		.pipe(concat('frontend.js'))
		.pipe(gulp.dest('js'));
});

gulp.task('sass', function(){
	gulp.src(sassSources)
		.pipe(sass({style: 'expanded', lineNumbers: true, errLogToConsole: true}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('css'))
		.pipe(livereload());
})

gulp.task('watch', function(){
	livereload.listen();

	gulp.watch(libSources, ['lib']);
	gulp.watch(jsSources, ['js']);
	gulp.watch(sassSources, ['sass']);
	gulp.watch( ['js/*.js', '*.html', 'css/*.css']).on('change', livereload.changed)

});


gulp.task('default', ['lib', 'js', 'watch']);