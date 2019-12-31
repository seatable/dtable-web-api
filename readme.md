# DTable-Web-api组件

## 测试步骤

### 搭建测试环境
1. 根目录下创建config文件夹
2. 在config文件夹下创建配置文件config.js
  配置内容如下：
  ```
    const ACCESS_CONFIG = {
      server:'http://127.0.0.1:8000',
      username:'****',
      password:'****'
    };

    export default ACCESS_CONFIG;
  ```

### 运行测试
  打开命令行，运行 `npm test -a`

## 开发步骤

### 方式一：
  1. 在当前项目中，添加相关api
  2. 运行测试，修改代码至正确为止
  3. 发布新版本，更新引用项目中dtable-wep-api的新版本
   
### 方式二
  1. 在引用项目中的node_modules/dtable-web-api/lib/dtable-web-pai.js中添加新的api
  2. 重新执行 `npm start`, 测试api添加是否正确，若错误，修改至正确为止
  3. 将添加的api更新到当前项目，
  4. 发布新版本，更新引用项目中dtable-wep-api的新版本

## 发布版本
1. 更新package.json中的version版本号
2. 执行 `npm publish`