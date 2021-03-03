import BezierEasing from 'bezier-easing'
import tinycolor, { ColorInputWithoutInstance } from 'tinycolor2'
import { CSSStr } from './theme'

const DEFAULT_PRIMARY_COLOR = '#1890ff'
const STORAGE_NAME = 'mini-dynamic-antd-theme-color'

/* basic-easiing */
const baseEasing = BezierEasing(0.26, 0.09, 0.37, 0.18)

const primaryEasing = baseEasing(0.6)
const currentEasing = (index) => baseEasing(index * 0.1)

/* tinycolor-mix */
tinycolor.mix = (color1, color2, amount) => {
  amount = amount === 0 ? 0 : amount || 50

  const rgb1 = tinycolor(color1).toRgb()
  const rgb2 = tinycolor(color2).toRgb()

  const p = amount / 100

  const rgba = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a,
  }
  return tinycolor(rgba)
}

function generateHoverColor(color, ratio = 5) {
  return tinycolor.mix('#ffffff', color, (currentEasing(ratio) * 100) / primaryEasing).toHexString()
}

function generateActiveColor(color, ratio = 7) {
  return tinycolor
    .mix('#333333', color, (1 - (currentEasing(ratio) - primaryEasing) / (1 - primaryEasing)) * 100)
    .toHexString()
}

function generateShadowColor(color, ratio = 9) {
  return tinycolor
    .mix('#fff', color, (1 - (currentEasing(ratio) - primaryEasing) / (1 - primaryEasing)) * 100)
    .toRgbString()
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

const generateCustomCss = (customCss: string|undefined) => {
  if (typeof customCss !== 'string'
    || (typeof customCss === 'string' && customCss.trim().length === 0)
  ) {
    return ''
  }
  customCss = customCss.replace(/\$primary\-color/g, 'var(--primary-color)')
  customCss = customCss.replace(/\$primary\-hover-color/g, 'var(--primary-hover-color)')
  customCss = customCss.replace(/\$primary\-active-color/g, 'var(--primary-active-color)')
  customCss = customCss.replace(/\$primary\-shadow-color/g, 'var(--primary-shadow-color)')
  return customCss
}

const generateStyleHtml = (colorObj: IColorObj, customCss?: string): string => {
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
    return `${cssVar}\n${CSSStr}\n${generateCustomCss(customCss)}`
  }
  let IECSSStr = `${CSSStr}\n${generateCustomCss(customCss)}`
  IECSSStr = IECSSStr.replace(/var\(\-\-primary\-color\)/g, primaryColor as string)
  IECSSStr = IECSSStr.replace(/var\(\-\-primary\-hover\-color\)/g, hoverColor as string)
  IECSSStr = IECSSStr.replace(/var\(\-\-primary\-active\-color\)/g, activeColor as string)
  IECSSStr = IECSSStr.replace(/var\(\-\-primary\-shadow\-color\)/g, shadowColor as string)
  return IECSSStr
}

export function generateThemeColor(color: ColorInputWithoutInstance): IColorObj {
  let primaryColor: string
  if (!tinycolor(color).isValid()) {
    console.log('The color param is not valid and will use the default primary color value!')
    primaryColor = DEFAULT_PRIMARY_COLOR
    return {
      primaryColor,
      hoverColor: generateHoverColor(primaryColor),
      activeColor: generateActiveColor(primaryColor),
      shadowColor: generateShadowColor(primaryColor),
    }
  }
  primaryColor = tinycolor(color).toHexString()
  return {
    primaryColor,
    hoverColor: generateHoverColor(primaryColor),
    activeColor: generateActiveColor(primaryColor),
    shadowColor: generateShadowColor(primaryColor),
  }
}

type IOptionsProps = {
  customCss?: string
  storageName?: string
}

const defaultOptions = {
  customCss: '',
  storageName: '',
}

export function changeAntdTheme(color: ColorInputWithoutInstance, options: IOptionsProps = defaultOptions) {
  const colorObj: IColorObj = generateThemeColor(color);
  const { customCss, storageName } = options;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageName || STORAGE_NAME, colorObj.primaryColor || DEFAULT_PRIMARY_COLOR)
  }
  let styleNode = document.getElementById('mini_dynamic_antd_theme_custom_style')
  if (!styleNode) {
    // avoid repeat insertion
    styleNode = document.createElement('style')
    styleNode.id = 'mini_dynamic_antd_theme_custom_style'
    styleNode.innerHTML = generateStyleHtml(colorObj, customCss)
    document.getElementsByTagName('head')[0].appendChild(styleNode)
  } else {
    styleNode.innerHTML = generateStyleHtml(colorObj, customCss)
  }
}
