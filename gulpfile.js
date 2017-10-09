const gulp        = require("gulp");
const lesshint    = require("gulp-lesshint");
const less        = require("gulp-less");
const cleanCSS    = require("gulp-clean-css");
const tslint      = require("tslint");
const gulpTslint  = require("gulp-tslint")
const ts          = require("gulp-typescript");
const uglify      = require("gulp-uglify");
const banner      = require("gulp-banner");
const rename      = require("gulp-rename");
const watch       = require("gulp-watch");
const run         = require("gulp-run");
const connect     = require("gulp-connect");
const runSequence = require("run-sequence");

const pkg         = require("./package.json");
const tsconfig    = ts.createProject("tsconfig.json", {outFile: `${pkg.name}.js`});
const comment     = `/*!
* ${pkg.title} v${pkg.version} (${pkg.homepage})
* Copyright 2017 ${pkg.author}
* Licensed under ${pkg.license} (${pkg.repository.url}/blob/master/LICENSE)
*/
`;

gulp.task("lesshint", () =>
  gulp.src("./src/*.less")
    .pipe(lesshint({
        // Options
    }))
    .pipe(lesshint.reporter())
    .pipe(lesshint.failOnError())
);

gulp.task("less", () =>
  gulp.src(`./less/${pkg.name}.less`)
    .pipe(less())
    .pipe(gulp.dest("./css"))
);

gulp.task("minify-css", () => {
  return gulp.src(`./css/${pkg.name}.css`)
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./css"));
});

gulp.task("tslint", () => {
  const program = tslint.Linter.createProgram("./tslint.json");
  return gulp.src("./ts/**/*.ts")
    .pipe(gulpTslint({program}))
    .pipe(gulpTslint.report({
      summarizeFailureOutput: true
    }))
});

gulp.task("ts", () =>
   gulp.src(["./ts/**/*.ts", "./typings/globals/**/*.d.ts"])
    .pipe(tsconfig()).js
    .pipe(gulp.dest("./js"))
);

gulp.task("compress", () =>
  gulp.src(`./js/${pkg.name}.js`)
    .pipe(uglify())
    .pipe(banner(comment))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./js"))
);

gulp.task("jekyll", () =>
  run("jekyll build --drafts --incremental").exec()
);

gulp.task("html", () =>
  gulp.src("./_site/**/*.html")
    .pipe(connect.reload())
);

gulp.task("connect", () =>
  connect.server({
    root: "_site",
    port: 4000,
    livereload: true,
  })
);

gulp.task("watch-ts", () =>
  watch("./ts/*.ts", () =>
    runSequence(
      "tslint",
      "ts",
      "compress",
      "jekyll",
    )
  )
);

gulp.task("watch-less", () =>
  watch("./less/*.less", () =>
    runSequence(
      "lesshint",
      "less",
      "minify-css",
      "jekyll",
    )
  )
);

gulp.task("watch-html", () =>
  gulp.watch(["./_site/**/*.html"], ["html"])
);

gulp.task("watch-jekyll", () =>
  gulp.watch(["./*", "_drafts/*", "_includes/*", "_layouts/*", "_posts/*", "apps/*", "attach/*", "fonts/*", "img/*"], ["jekyll"])
);

gulp.task("watch", () =>
  runSequence(
    ["watch-ts", "watch-less", "watch-html", "watch-jekyll"]
  )
);

/* ----------- */

gulp.task("less-tcupdate", () =>
  gulp.src("./less/tcupdate.less")
    .pipe(less())
    .pipe(gulp.dest("./css"))
);

gulp.task("compress-tcupdate", () =>
  gulp.src("./js/tcupdate.js")
    .pipe(uglify())
    .pipe(banner(comment))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./js"))
);

gulp.task("minify-css-tcupdate", () =>
  gulp.src("./css/tcupdate.css")
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./css"))
);

gulp.task("tcupdate", callback =>
  runSequence(
    "less-tcupdate",
    "compress-tcupdate",
    "minify-css-tcupdate",
    callback,
  )
);

/* ----------- */

gulp.task("build", callback =>
  runSequence(
    ["lesshint", "tslint"],
    ["less", "ts", "tcupdate"],
    ["minify-css", "compress"],
    "jekyll",
    callback,
  )
);

gulp.task("default", callback =>
  runSequence(
    "build",
    ["connect", "watch"],
));