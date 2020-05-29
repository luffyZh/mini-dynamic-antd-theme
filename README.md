![](./mini-dynamic-antd-theme.png)

A simple plugin to dynamic change [ant-design](https://ant.design) || [ant-design-vue](https://www.antdv.com) theme whether less or css.

> After gzip: 10.6kB

## 🌍 Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) |
| --- | --- | --- | --- | --- |
| Chrome 39.0+ ✔ | Edge 12.0+ ✔ | Firefox 30.0+ ✔ | IE 10+ ✔ | Safari 9.1+ ✔ |

## 📦 Install

`npm install mini-dynamic-antd-theme` or `yarn add mini-dynamic-antd-theme`


## 🔨 Usage && 🎆 Effects

### Ant-Design

```
import { generateThemeColor, changeAntdTheme } from 'mini-dynamic-antd-theme';

<div className={styles.themeContainer}>
  Change theme：
  <span 
    className={styles.theme_color_pink}
    onClick={
      () => changeAntdTheme(
        generateThemeColor('pink')
      )
    }
  />
  <span 
    className={styles.theme_color_green}
    onClick={
      () => changeAntdTheme(
        generateThemeColor('green')
      )
    }
  />
</div>
```

![](./ant-design-effects.gif)

### Ant-Design-Vue

```
<template>
 <div class="theme-container">
    Change Theme:
    <span @click="changeThemeColor('pink')" class="theme-color-pink" />
    <span @click="changeThemeColor('green')" class="theme-color-green" />
  </div>
</template>

<script>
import { generateThemeColor, changeAntdTheme } from 'mini-dynamic-antd-theme';

...

export default {
  name: 'App',
  methods: {
    changeThemeColor (color) {
      console.log(color, 8989);
      changeAntdTheme(
        generateThemeColor(color)
      )
    }
  }
};

</script>
```
![](./ant-design-vue-effects.gif)

### More Example

#### How to change other element (not ant-design components) color?

The `mini-dynamic-antd-theme` will store the primary-color value in the localStorage named `mini-dynamic-antd-theme-color` after the theme color is changed.

```
// When the theme color has changed， we can change the dom that id = 'header_bar' bg color.

document.getElementById('header_bar').style.backgroundColor
  = window.localStorage.getItem('mini-dynamic-antd-theme-color');

```

## 🌞 Export
| export       | Description         |
| ---------- | ------------ |
| generateThemeColor   | `param: color`, generate colorObj based on color  |
| changeAntdTheme   | `param: colorObj`, change the antd theme |


## 🍎 Attention

**This solution is easy to use, so it is prone to problems. We hope you can give us timely feedback. For example, if there is a problem with any component, we will fix the updated version as soon as possible.**

 - The current version requires your antd version to be lower than v3.25.0

After the version_4.0, `ant-design` has lots of changes. So the plugin could have some problems, you can find and give me a issue. I'll fix it as soon as possible.


## 🌈 More detail u can go to the [dynamic-antd-theme](https://github.com/luffyZh/dynamic-antd-theme)
