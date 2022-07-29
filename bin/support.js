const fs = require('fs')
let shell = require("shelljs")
let errArr = []


console.log(process.argv)
let list = process.argv.splice(2, process.argv.length - 1)
shell.cd('tarballs')

// fs.writeFileSync("download-log.txt", JSON.stringify(list), { flag: 'a+' })

list.forEach((item, index) => {
  shell.exec(`npm pack ${item}`, function (err) {
    if (err) {
      errArr.push(item)
      fs.writeFileSync("download-log.txt", JSON.stringify(errArr))
    }
    if (index == list.length - 1) {
      console.log('下载完成!')
    }
  })
})