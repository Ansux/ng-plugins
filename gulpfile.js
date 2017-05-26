/**
 * @author su
 * @createtime 2017-05-25
 * @description 由于Webpack打包不支持IE8，所有选择这套(Gulp+Browserify)的解决方案，下面对一些包模块进行一一注释
 * - babel：用于支持ES6新特性，可通过修改.babelrc文件来自定义语法规则
 * - eslint：用于对JS语法检查，可通过修改.eslintrc文件来自定义语法规则
 * - uglify：用于对JS代码进行压缩合并
 * - concat：用于对文件的合并
 * - sass：用于对sass文件的编译
 * - autoprefixer：为CSS3属性添加浏览器厂商前缀
 * - cssnano：用于对css代码的压缩
 * - htmlmin：用于对html文件的压缩
 * - clean：用于对目录文件的清除工作，项目打包前将用它来删除dist目录
 * - browserify：用于对commonJS的支持
 * - babelify：使browserify支持babel语法的解析
 * - partialify：使browserify支持html,css的引入
 * - source：用于对browserify文件流的输出
 * - buffer：将browserify文件流转换为gulp流，使它支持后续的pipe操作
 * - browserSync：浏览器同步预览
 */

const gulp = require('gulp')
// const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')

const htmlmin = require('gulp-htmlmin')

const clean = require('gulp-clean')
const browserify = require('browserify')
const babelify = require('babelify')
const partialify = require('partialify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const sequence = require('gulp-sequence')
const browserSync = require('browser-sync').create()

/* config */
const files = {
  app: 'src/app.js',
  js: ['src/components/*/*.js', 'src/*.js'],
  vendor: ['assets/js/angular.min.js'],
  view: ['src/components/*/*.html'],
  scss: ['src/scss/app.scss'],
  index: ['src/index.html']
}

/* task-clean */
gulp.task('clean', () => {
  return gulp.src('dist', {
    read: false
  }).pipe(clean())
})

/* task-js */
gulp.task('js', () => {
  return browserify(files.app)
    .transform(babelify)
    .transform(partialify)
    .bundle()
    .on('error', function(err){
      console.error(`Error: ${err.message}`)
      this.emit('end')
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

/* task-eslint */
gulp.task('eslint', () => {
  return gulp.src(files.js)
    .pipe(eslint())
    .pipe(eslint.format())
})

/* task-vendor */
gulp.task('vendor', () => {
  return gulp.src(files.vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'))
})

/* task-css */
gulp.task('scss', () => {
  return gulp.src(files.scss)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
})

/* task-html */
gulp.task('index', () => {
  gulp.src(files.index)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'))
})

/* task-browserSync */
gulp.task('browserSync', () => {
  browserSync.init(['./dist/**/*.*'], {
    server: {
      baseDir: './dist'
    }
  })
})

/* task-watch */
gulp.task('watch', ['browserSync'], () => {
  gulp.watch(files.app, ['js'])
  gulp.watch(files.js, ['js'])
  gulp.watch(files.view, ['js'])
  
  gulp.watch(files.scss, ['scss'])
  gulp.watch(files.index, ['index'])

  /* watch file add，delete */
  gulp.watch('src/**/*.*')
    .on('change', (e) => {
      let filePath = e.path
      let pathArr = filePath.split('.')
      let ext = pathArr[pathArr.length - 1]
      // 根据文件后缀来判断并执行相应的任务
      if (ext === 'js') {
        gulp.src(filePath)
          .pipe(eslint())
          .pipe(eslint.format())
        sequence('js')
      } else if (ext === 'html') {
        sequence('js')
      } else {
        sequence(ext)
      }
    })
})

/* task-build */
gulp.task('build', sequence('clean', ['vendor', 'eslint', 'js', 'scss', 'index']))

/* task-default */
gulp.task('default', sequence('build', ['watch']))