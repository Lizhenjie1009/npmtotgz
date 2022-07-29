#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
let shell = require("shelljs")
const configFile = path.resolve(process.cwd(), './package-lock.json')
const child_process = require('child_process');
// 结果输出目录
let outputDir = 'tarballs'
/**
* 读取文件
*/
try {
  shell.mkdir(outputDir)
  shell.cd(outputDir)
  if (process.argv[2] === 'list') {
    shell.exec(`npm list`, async function (err, file) {
      if (err) {
        fs.writeFileSync("download-log.txt", JSON.stringify(err), { flag: 'a+' })
      }
      file = file.replace(/\n/g, () => ',')
      .replace(/\s+/g, () => '')
      .replace(/`|\||\|`|\|\|`|--|\+--/g, () => '')
      file = file.split(',').splice(1)
      file = [...new Set(file)]
      fs.writeFileSync("npm-list.json", JSON.stringify(file))
      if (process.argv[3] !== 'export')
      downloadDeps(dealDeps(file), [])
    })
  } else  if (process.argv[2] === '-d') {
    let npmPkg = JSON.parse(fs.readFileSync(process.argv[3], 'UTF-8').toString())
    downloadDeps(dealDeps(npmPkg), [])
  } else {
    const data = fs.readFileSync(configFile, 'UTF-8').toString()
    let pkg = JSON.parse(data)
    let dep = pkg.dependencies
    // npmPkg = [...new Set(findDeps(dep))]
    findDeps(dep)
    // npmPkg = dealDeps([...new Set(findDeps(dep))])
  // npmPkg.forEach((list, idx) => {
  //   console.log(idx)
  //   shell.cd(process.cwd())
  //   let worker = child_process.fork(path.resolve(__dirname, './support.js'), list)
  //   worker.on('close', function (code) {
    //     console.log('子进程退出',code)
    //   })
    // })
  }
}
catch (error) {
  console.log('read file', error)
}


function findDeps(deps) {
  let result = []
  let npmPkg = []
  for (var name in deps) {
    result.push(`${name}@${deps[name].version}`)
    let depRequires = deps[name].requires
    let depChilds = deps[name].dependencies
    if (depChilds) {
      findDeps(depChilds)
    }
    if (depRequires) {
      for (var name in depRequires) {
        result.push(`${name}@${depRequires[name]}`)
      }
    }
    
  }
  if (process.argv[2] === 'export') {
    fs.writeFileSync("npm-lock.json", JSON.stringify([...new Set(result)]))

  } else {
    npmPkg = dealDeps([...new Set(result)])
    downloadDeps(npmPkg, [])
  }
}


function dealDeps (pkgArr) {
  let lenGroup = 0
  let groupPkg = []
  lenGroup = Math.ceil(pkgArr.length / 100)
  for (var i = 0; i < lenGroup; i++) {
    groupPkg.push(pkgArr.splice(0, 100))
  }
  return groupPkg
}

function downloadDeps (npmPkg, errArr) {
  npmPkg.forEach((list) => {
    list.forEach((item, index) => {
      shell.exec(`npm pack ${item}`, function (err) {
        if (err) {
          errArr.push(item)
          fs.writeFileSync("download-log.txt", JSON.stringify(errArr), { flag: 'a+' })
        }
        if (index == list.length - 1) {
          console.log('下载完成!')
        }
      })
    })
  })
}