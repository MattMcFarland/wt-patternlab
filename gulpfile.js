"use strict";

/* Module Dependencies */
var
    gulp = require('gulp'),
    gsass = require('gulp-sass'),
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    bS = require('browser-sync').create();

require('shelljs/global');

if (!which('php')) {
    echo('Sorry, this script requires php command line installed');
    exit(1);
}

function sass (entry, name, dest) {
    return gulp.src(entry)
        .pipe(gsass())
        .on('error', gutil.log)
        .on('end', (a) => {
            gutil.log('File Saved', gutil.colors.cyan(dest + '/' + name + '.css'));
        })
        .pipe(gulp.dest(dest));
}
function php () {
    return gulp.src('public/index.html')
        .pipe(shell([
            'php core/builder.php --generate --patternsonly'
        ]));
}
function watch_sass () {
    sass('source/css/style.scss', 'style', 'public/css');
    gutil.log(gutil.colors.magenta('[SASS]'), '- Watch "', gutil.colors.cyan('source/**/*'), '"');
    gulp.watch('source/css/**/*.scss', (e) => {
        gutil.log('File Changed', gutil.colors.cyan(e.path));
        sass('source/css/style.scss', 'style', 'public/css')
    });
}
function watch_php () {
    php();
    gutil.log(gutil.colors.magenta('[PHP]'), '- Watch "', gutil.colors.cyan('source/**/*'), '"');
    gulp.watch('source/css/**/*.scss', (e) => {
        gutil.log('File Changed', gutil.colors.cyan(e.path));
        php();
        sass('source/css/style.scss', 'style', 'public/css')
    });
}

gulp.task('serve', () => {
    bS.init({
        server: {
            baseDir: 'public'
        }
    });

    gulp.watch(['public/**/*.html'], bS.reload);
    watch_sass();
    watch_php();
});


gulp.task('watch-sass', () => watch_sass());
gulp.task('watch-source', () => watch_php());
gulp.task('sass', () => sass('source/css/style.scss', 'style', 'public/css'));
gulp.task('php', () => php());