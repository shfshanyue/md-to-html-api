# Mardown to HTML API

> Powerd by [mdnice](https://www.mdnice.com)

借助于优秀的开源工具 `mdnice`，根据 `mardown` 生成美化 `html` 的 GraphQL API 服务。

[快来试一试效果~](https://service-1sbq8kkt-1257314149.sh.apigw.tencentcs.com/graphql)

## API

### mardown to html

> 快来在 [GraphQL Playground](https://service-1sbq8kkt-1257314149.sh.apigw.tencentcs.com/graphql) 中试一试效果

``` gql
query HTML (
  $markdown: String!
  $endpoint: String
  $theme: String
  $formatType: FormatType
) {
  html (
    markdown: $markdown, 
    browserWSEndpoint: $endpoint,
    theme: $theme
    formatType: $formatType
  )
}
```

其中:

1. `markdown`: 必填，你需要转换的 markdown 内容
1. `endpoint`: 选填，[browserless](https://www.browserless.io/) 中的服务接口，也可自建服务，默认值为 `wss://chrome.browserless.io/`
1. `theme`: 选填，[mdnice](https://mdnice.com) 中的主题名称，默认为 `蔷薇紫`
1. `formatType`: 选填，可选 `[JUEJIN | WECHAT | ZHIHU ]`，转换后 html 适应各平台的格式，默认为 `JUEJIN`

示例如下：

``` json
{
  "markdown": "## Hello, shanyue",
  "endpoint": "wss://chrome.shanyue.tech",
  "theme": "全栈蓝",
  "formatType": "WECHAT"
}
```

![根据 markdown 生成 html](./assets/html.jpg)

## Develop

可以通过以下方式快速基于此项目开发，并欢迎提交 PR 及 Fork

``` bash
# 本地启动，快速调试项目
$ npm run dev

# 调试 pptr
$ DEBUG=* npm run dev

# 在本地浏览器调试 pptr (在本地调试时如果不是 MAC，需要手动指定 chrome 位置)
$ DEBUG=1 npm run dev
```

## Deploy

本项目部署在腾讯云 serverless 中，在部署前可以指定以下环境变量，如未指定，则默认环境变量取以下的值

``` bash
# browserless 的服务入口地址，可使用自己的付费地址或自建
DEFAULT_ENDPOINT="wss://chrome.browserless.io/"

# mdnice 官网地址
MD_NICE="https://mdnice.com"
```

其中：

+ `DEFAULT_ENDPOINT`: [browserless](https://www.browserless.io/) 中的服务接口，也可自建服务，默认值为 `wss://chrome.browserless.io/`
+ `MD_NICE`: [mdnice](https://mdnice.com/) 地址，可自建服务

快速部署：

``` bash
$ npm i -g serverless
$ sls --debug
```

部署资源配置文件 `serverless.yml` 由于是高延迟服务，记得把函数超时及网关超时设置到 200s，如下所示:

``` yml
component: express # (required) name of the component. In that case, it's express.
name: markdown-to-html-api
org: shanyue

inputs:
  src: ./ # (optional) path to the source folder. default is a hello world app.
  functionName: mardown-api
  region: ap-shanghai
  runtime: Nodejs12.16
  exclude:
    - .env
  functionConf:
    timeout: 200
    memorySize: 128
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
    enableCORS: true #  允许跨域
    serviceTimeout: 200
```

## 关于我

我是山月，博客地址在 [shfshanyue/blog](https://github.com/shfshanyue/blog)，欢迎添加微信 `shanyue94` 与我交流。
