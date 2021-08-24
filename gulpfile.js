
let project_folder = "dist";
let source_folder  = "src";

let path={
    build:{
        html:       project_folder + "/",
        css:        project_folder + "/assets/css",
        cssLib:     project_folder + "/assets/css",
        js:         project_folder + "/assets/js",
        img:        project_folder + "/assets/img",
        fonts:      project_folder + "/assets/fonts",
    },
    src:{
        html:      [source_folder + "/*.html", "!" + source_folder + "/components/__*.html"],
        css:       source_folder + "/assets/scss/style.scss",
        cssLib:    source_folder + "/assets/scss/plugins.scss",
        js:        source_folder + "/assets/js/script.js",
        pluginsJs: source_folder + "/assets/js/plugins/*.js",
        img:       source_folder + "/assets/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts:     source_folder + "/assets/fonts/*.ttf",
    },
    watch:{
        html:      source_folder + "/**/*.html",
        css:       source_folder + "/assets/scss/**/*.scss",
        cssLib:    source_folder + "/assets/scss/plugins.scss",
        js:        source_folder + "/assets/js/**/*.js",
        pluginsJs: source_folder + "/assets/js/plugins/*.js",
        img:       source_folder + "/assets/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require ('gulp'),
    gulp          = require ('gulp'),
    browsersync   = require ("browser-sync").create(),
    fileinclude   = require ("gulp-file-include"),
    del           = require ("del"),
    scss          = require('gulp-sass')(require('sass'));
    clean_css     = require ("gulp-clean-css"),
    rename        = require ("gulp-rename"),
    autoprefixer  = require ("gulp-autoprefixer"),
    imagemin      = require ("gulp-imagemin"),
    uglify        = require ("gulp-uglify-es").default,
    ttf2woff      = require ('gulp-ttf2woff'),
    ttf2woff2     = require ('gulp-ttf2woff2'),
    concat        = require ('gulp-concat');



function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function plugins() {
    return src(path.src.cssLib)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                grid:true,
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(clean_css())
        .pipe(
            rename({
                extname:".min.css"
            })
        )
        .pipe(dest(path.build.cssLib))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                grid:true,
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname:".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function pluginJs() {
    return src(path.src.pluginsJs)
        .pipe(
            uglify()
        )
        .pipe(concat('plugins.min.js'))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(params) {
    src(path.src.fonts)
        // .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        // .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

function fontscopy() {
    src(path.src.fonts)
    .pipe(dest(path.build.fonts));
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.cssLib], plugins);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.pluginsJs], pluginJs);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js,pluginJs,css, plugins, html, images,fonts,fontscopy));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts   = fonts;
exports.fontscopy   = fontscopy;
exports.images  = images;
exports.js      = js;
exports.pluginJs = pluginJs;
exports.html    = html;
exports.css     = css;
exports.cssLib  = plugins;
exports.build   = build;
exports.watch   = watch;
exports.default = watch;


