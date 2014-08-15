var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('sass', function() {
    gulp.src('./../public/stylesheets/*.sass')
        .pipe(sass({sourcemap: false, style: 'compact'}))
        .pipe(gulp.dest('./../public/stylesheets'));
});

gulp.task('watch', function() {
	var watcher = gulp.watch('./../public/stylesheets/**/*.sass', ['sass']);
	
	watcher.on('change', function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

// uncomment `sass` task if your want compile after start
gulp.task('default', [/*'sass',*/ 'watch']);