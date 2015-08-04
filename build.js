import path from 'path'
import fsp from 'fs-promise'
import fse from 'fs-extra'
import { exec } from 'child-process-promise'

import 'colors'

const vendors = [
  './src/index.html',
  './node_modules/react/dist/react.js',
  './node_modules/react/dist/react.min.js',
  './node_modules/react-router/umd/ReactRouter.min.js',
  './node_modules/marked/marked.min.js',
  './node_modules/reflux/dist/reflux.min.js'
]
const assetsDest = './assets'

function copy (src, dest, options) {
  options = options || {}

  return Promise.all([
      fsp.stat(src),
      fsp.exists(dest)
        .then(exists => {
          if (!exists) {
            return false
          }

          return fsp.stat(dest)
        })
    ])
    .then(([srcStat, destStat]) => {
      if (srcStat.isFile() && destStat && destStat.isDirectory()) {
        let filename = path.basename(src)
        dest = path.join(dest, filename)
      }

      return new Promise((resolve, reject) => {
        fse.copy(src, dest, options, err => {
          if (err) {
            reject(err)
          }

          resolve()
        })
      })
    })
}

let jobs = vendors.map((srcFile) => {
  return copy(srcFile, assetsDest)
})

jobs.push(exec('webpack --config webpack.config.js -p'))

console.log('Build start...')

fse.emptyDirSync(assetsDest)

Promise.all(jobs)
  .then(() => {
    console.log('Build success.')
  })
  .catch((err) => {
    if (err.stack) {
      console.error(err.stack.red)
    } else {
      console.error(err.toString().red)
    }
    process.exit(1)
  })
