const fs = require('fs')
const less = require('less')

let __DEV__ = process.argv.includes('dev')
const sourceFileName = 'style.less'
const sourcePath = __dirname + '/src/' + sourceFileName
const targetPath = __dirname + '/dist/' + 'site.css'

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

if (__DEV__) {
  console.log('✅ Watching less file')
  __dev()
} else {
  __build()
}

function __dev() {
  function transfrom(path) {
    fs.readFile(path, { encoding: 'utf8' }, (error, lessString) => {
      error && console.error(error)
      less.render(lessString, { paths: ['./'] }, (err, css) => {
        err && console.error(err)
        if (css) {
          fs.writeFile(targetPath, css.css, writeError => {
            if (writeError) {
              console.error(writeError)
            } else {
              console.log('✅')
              console.log('css build success', new Date())
            }
          })
        }
      })
    })
  }

  transfrom(sourcePath)
  fs.watchFile(sourcePath, { interval: 100 }, () => {
    transfrom(sourcePath)
  })
}

async function __build() {
  const lessString = fs.readFileSync(sourcePath, { encoding: 'utf8' })
  const { css: cssString } = await less.render(lessString)
  console.log('✅ Less built success')
  fs.writeFileSync(targetPath, cssString)
}
