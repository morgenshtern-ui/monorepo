import { getWindow } from '@teleskop-labs/ssr-window'

let browser

function calcBrowser() {
  const window = getWindow()
  let needPerspectiveFix = false

  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase()

    return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')
  }

  if (isSafari()) {
    const ua = String(window.navigator.userAgent)

    if (ua.includes('Version/')) {
      const [major, minor] = ua
        .split('Version/')[1]
        .split(' ')[0]
        .split('.')
        .map(num => Number(num))

      needPerspectiveFix = major < 16 || (major === 16 && minor < 2)
    }
  }

  return {
    isSafari: needPerspectiveFix || isSafari(),
    needPerspectiveFix,
    isWebView: /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(window.navigator.userAgent),
  }
}

function getBrowser() {
  if (!browser)
    browser = calcBrowser()

  return browser
}

export { getBrowser }
