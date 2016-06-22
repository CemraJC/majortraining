var gulp = require("gulp"),
    m = require("gulp-load-plugins")();


var path = {
    sass: "sass/",
    site: "_site/"
}


gulp.task('sass', function(){
    return gulp.src(path.sass + 'main.scss')
           .pipe(m.sourcemaps.init())
           .pipe(m.cssnano())
           .pipe(m.sass({"includePaths" : path.sass + "imports"}).on('error', m.sass.logError))
           .pipe(m.autoprefixer({"browsers": "> 1%"}))
           .pipe(m.sourcemaps.write('.'))
           .pipe(gulp.dest(path.site + "css/"));
})


gulp.task('default', ['sass']);