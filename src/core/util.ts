import chroma from 'chroma-js'
import { CSSContent } from './theme'

const DEFAULT_PRIMARY_COLOR = '#1890ff'
const STORAGE_NAME = 'mini-dynamic-antd-theme-color'

function generateHoverColor(color, ratio = 5) {
  return chroma.mix(DEFAULT_PRIMARY_COLOR, '#fff', 0.24, 'rgb').hex()
}

function generateActiveColor(color, ratio = 7) {
  return chroma.mix(DEFAULT_PRIMARY_COLOR, '#333', 0.24, 'rgb').hex()
}

function generateShadowColor(color, ratio = 9) {
  return chroma.mix(DEFAULT_PRIMARY_COLOR, '#888', 0.74, 'rgb').alpha(.2).css()
}

// 判断是否是IE系列浏览器
function IEVersion() {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6 // IE版本 <= 7
    }
  } else if (isEdge) {
    return 'edge' // edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return 0 // 不是ie浏览器
  }
}

type IColorObj = {
  primaryColor: string
  hoverColor: string
  activeColor: string
  shadowColor: string
}

const generateStyleHtml = (colorObj: IColorObj): string => {
  const { activeColor, primaryColor, hoverColor, shadowColor } = colorObj
  if (!IEVersion()) {
    const cssVar = `
      :root {
        --primary-color: ${primaryColor};
        --primary-hover-color: ${hoverColor};
        --primary-active-color: ${activeColor};
        --primary-shadow-color: ${shadowColor};
      }
    `
    return `${cssVar}\n${CSSContent}`
  }
  let IECSSContent = CSSContent
  IECSSContent = IECSSContent.replace(/var\(\-\-primary\-color\)/g, primaryColor as string)
  IECSSContent = IECSSContent.replace(/var\(\-\-primary\-hover\-color\)/g, hoverColor as string)
  IECSSContent = IECSSContent.replace(/var\(\-\-primary\-active\-color\)/g, activeColor as string)
  IECSSContent = IECSSContent.replace(/var\(\-\-primary\-shadow\-color\)/g, shadowColor as string)
  return IECSSContent
}

/**
 * Generate the primary colorObj according to the incoming color
 * @param color
 * The argument here can be any legal color value representation
 * For example, hex/ HSL/RGB /rgba, etc
 * As long as the chroma.valid(color) is validated 
 */
export function generateThemeColor(color: any): IColorObj {
  let primaryColor: string
  if (!chroma.valid(color)) {
    console.log('The color param is not valid and will use the default primary color value!')
    primaryColor = DEFAULT_PRIMARY_COLOR
    return {
      primaryColor,
      hoverColor: generateHoverColor(primaryColor),
      activeColor: generateActiveColor(primaryColor),
      shadowColor: generateShadowColor(primaryColor),
    }
  }
  primaryColor = chroma(color).hex()
  return {
    primaryColor,
    hoverColor: generateHoverColor(primaryColor),
    activeColor: generateActiveColor(primaryColor),
    shadowColor: generateShadowColor(primaryColor),
  }
}

export function changeAntdTheme(colorObj: IColorObj) {
  window.localStorage.setItem(STORAGE_NAME, colorObj.primaryColor || DEFAULT_PRIMARY_COLOR)
  let styleNode = document.getElementById('mini_dynamic_antd_theme_custom_style')
  if (!styleNode) {
    // avoid repeat insertion
    styleNode = document.createElement('style')
    styleNode.id = 'mini_dynamic_antd_theme_custom_style'
    styleNode.innerHTML = generateStyleHtml(colorObj)
    document.getElementsByTagName('head')[0].appendChild(styleNode)
  } else {
    styleNode.innerHTML = generateStyleHtml(colorObj)
  }
}
