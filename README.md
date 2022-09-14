## 一、基础环境要求
- Node版本：>=12.12.0

## 二、开发、管理工具
- VSCode 

## 三、框架介绍
- Vue 版本: v2.6.12
- Element UI：v2.15.6

## 四、环境介绍
### 启动服务
npm run dev

### 安装依赖
npm install

### 打包生产环境
npm run build:test
npm run build:prod
npm run zip

### 检测代码规范
npm run lint
npm run lint:style

### 修复代码规范
npm run lint --fix 
npm run fix:style

## 五、主要库
- Element https://element.eleme.io/#/zh-CN/component/installation
- lodash  JS实用工具库 https://www.lodashjs.com/
- svg-icon  图标库 https://www.freesion.com/article/4316893239/
- Mocker Mock模拟数据（开启MOCK：.env.development文件VUE_APP_NO_PROXY = 'false'）
- commitlint + stylelint   自动修复错误、格式化样式代码
