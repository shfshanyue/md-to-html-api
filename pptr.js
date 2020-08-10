const puppeteer = require('puppeteer-core')

const DEFAULT_ENDPOINT = process.env.ENDPOINT || 'wss://chrome.browserless.io/'
const MD_NICE = process.env.MD_NICE || 'https://mdnice.now.sh'

function getBrowser (endpoint) {
  const isDebug = Boolean(process.env.DEBUG)
  return isDebug ? puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    devtools: true
  }) : puppeteer.connect({ browserWSEndpoint: endpoint })
}

function setting (page, config) {
  return page.evaluate(({
    content,
    theme,
    codeTheme
  }) => {
    const themeList = JSON.parse(localStorage.theme_list)
    let id = 1
    // themeId 指 themeList 中的 index
    //
    // const targetTheme = themeList.find((x, index) => id = index && x.name === theme)
    // const themeId = targetTheme ? targetTheme.themeId : 1
    themeList.find((x, index) => (id = index) && x.name === theme)
    const themeId = id
    const codeThemeId = 1

    localStorage.content = content
    localStorage.template_num = themeId
    localStorage.code_num = codeThemeId
  }, config)
}

async function getHtmlFromMd (content, {
  browserWSEndpoint = DEFAULT_ENDPOINT,
  theme = '蔷薇紫',
  codeTheme = '2',
  formatType = 'juejin'
}) {
  const browser = await getBrowser(browserWSEndpoint)

  try {
    const context = browser.defaultBrowserContext()
    context.overridePermissions(MD_NICE, ['clipboard-read'])

    const page = await browser.newPage()

    await page.goto(MD_NICE, {
      timeout: 90000,
      waitUntil: 'networkidle0'
    });
    
    // configure markdon theme and code theme
    await setting(page, { theme, codeTheme, content })

    await page.reload({
      timeout: 90000,
      waitUntil: 'networkidle0'
    })

    // 添加微信外链脚注
    if (formatType === 'weixin') {
      await page.evaluate(() => {
        document.getElementById('nice-menu-link-to-foot').click()
      })
    }

    // 复制微信内容
    await page.click(`#nice-sidebar-${formatType}`)

    // 读取剪贴板内容
    const html = await page.evaluate(() => {
      return navigator.clipboard.readText()
    })
    return html
  } catch (e) {
    throw e
  } finally {
    await browser.close()
  }
}

module.exports = {
  getHtmlFromMd
}
