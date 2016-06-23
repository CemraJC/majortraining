var gulp = require("gulp"),
    m = require("gulp-load-plugins")(),
    browserSync = require('browser-sync').create(),
    spawn = require('child_process').spawn


var path = {
    sass: "sass/",
    site: "_site/",
    js: "js/modules/"
}


gulp.task('js', function(){

    gulp.src(path.js + "../init.js")
        .pipe(gulp.dest(path.site + "js/"));

    return gulp.src(path.js + "*.js")
               .pipe(m.sourcemaps.init())
               .pipe(m.concat('main.js'))
               .pipe(m.uglify())
               .pipe(m.sourcemaps.write('.'))
               .pipe(browserSync.stream())
               .pipe(gulp.dest(path.site + "js/"));
});

gulp.task('sass', function(){
    return gulp.src(path.sass + 'main.scss')
               .pipe(m.changed(path.site + "css/"))
               .pipe(m.sourcemaps.init())
               .pipe(m.cssnano())
               .pipe(m.sass({"includePaths" : path.sass + "imports"}).on('error', m.sass.logError))
               .pipe(m.autoprefixer({"browsers": "> 1%"}))
               .pipe(m.sourcemaps.write('.'))
               .pipe(browserSync.stream())
               .pipe(gulp.dest(path.site + "css/"));
})

gulp.task('jekyll', function(callback){
    runJekyll(['build'], callback);
});

function runJekyll(args, callback){
    var jekyll = spawn('jekyll.bat', args, {stdio: 'inherit'});

    jekyll.on('exit', function(ecode) {
        callback(ecode === 0 ? null : 'ERROR (Jekyll): '+ecode);
    });

    jekyll.on('error', function(event) {
        callback("Jekyll error: " + event.message);
    });
}

gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: path.site
        },
        reloadDebounce: 2000,
        online: false,
        notify: false
    });
})

gulp.task("watch", function(){
    runJekyll(['build', '--watch']);

    gulp.watch(path.js + '**/*.js', ['js'])
    .on('change', function(event){
        console.log('JavaScript ' + event.path + ' was ' + event.type);
    })

    gulp.watch(path.sass + '**/*.scss', ['sass'])
    .on('change', function(event){
        console.log('Stylesheet ' + event.path + ' was ' + event.type);
    });

    gulp.watch('_site/*.html', {debounceDelay: 1500}).on('change', browserSync.reload);
});


gulp.task('build', ['jekyll', 'sass', 'js']);
gulp.task('default', ['build', 'serve', 'watch']);