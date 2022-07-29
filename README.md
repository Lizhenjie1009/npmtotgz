# npm 依赖转 tgz

> npm i npmtotgz -g

执行命令在package.json目录下执行 npm-tgz 将下载所有依赖。

# 下载
## npm-tgz                根据package-lock.json进行依赖下载
## npm-tgz list           根据npm list关系进行下载
## npm-tgz -d filePath    指定文件绝对路径下载, 文件内容如下
  ['vue@2.0.0' , 'axios@1.0.2']


# 导出依赖文件
## npm-tgz export         根据package-lock.json导出依赖包
## npm-tgz list export    根据npm list关系导出依赖包