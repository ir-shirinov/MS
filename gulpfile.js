"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var run = require("run-sequence");
var cheerio = require('gulp-cheerio');


gulp.task("compress", function (cb) {
  pump([
        gulp.src("js/*.js"),
        uglify(),
        gulp.dest("build/js")
    ],
    cb
  );
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("normalize", function(){
  return gulp.src("css/normalize.css")
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("normalize.min.css"))
    .pipe(gulp.dest("build/css"));
  })

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
  gulp.watch("js/*.js", ["compress"]);
});

gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function(){
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality:90}))
    .pipe(gulp.dest("build/img"));
})

gulp.task("sprite", function(){
  return gulp.src("img/icon-*.svg")
    .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
})

gulp.task("html", function(){
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
})

gulp.task("copy", function(){
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
})

gulp.task("clean", function(){
  return del("build");
  })

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "compress",
    "normalize",
    "style",
    "sprite",
    "html",
    done
  );
});
