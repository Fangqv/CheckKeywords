// ==UserScript==
// @name         流浪防区隐藏某些 POST
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/r/China_irl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

/******/ ;(() => {
  // webpackBootstrap
  /******/ 'use strict'
  var __webpack_exports__ = {} // CONCATENATED MODULE: ./src/once.ts

  async function onceFind(options) {
    let action
    let ms = 10
    let timeout = 5000
    let id
    if (typeof options === 'function') {
      action = options
    } else {
      ms = options.ms || 10
      timeout = options.timeout || 5000
      action = options.action
      id = options.id
    }
    return new Promise((resolve, reject) => {
      if (typeof action !== 'function') {
        const rejectInfo = 'action is not a function!' + (id ? `[${id}]` : '')
        reject(rejectInfo)
      } else {
        const timer = setInterval(() => {
          const element = action()
          if (element) {
            clearInterval(timer)
            resolve(element)
          }
        }, ms)
        setTimeout(() => {
          clearInterval(timer)
          const rejectInfo = `timeout: ${timeout}` + (id ? `[${id}]` : '')
          reject(rejectInfo)
        }, timeout)
      }
    })
  } // CONCATENATED MODULE: ./src/main.ts

  //  🚧🔧🔩🧱 关键词
  const BlockKeyWords = [
    '俄',
    '乌',
    '哈尔科夫',
    '格鲁吉亚',
    '普京',
    '泽连斯基',
    '北约',
  ]
  //  🚧🔧🔩🧱 是否隐藏列表中的广告
  const HideAD = true
  //  🚧🔧🔩🧱 是否隐藏标题中存在关键词的 POST
  const HideFlag = true
  //  🚧🔧🔩🧱 隐藏方式, Dim = true 则使用 opacity:0.1 而非 display:none
  const Dim = false
  const FlagClassName = 'FQKill'
  const ADFlagClassName = 'FQADKill'
  const PostListClassName = 'rpBJOHq2PR60pnwJlUyP0'
  const PostClassName = '_eYtD2XCVieq6emjKBH3m'
  function Main() {
    //  每次进行网络请求就遍历两次 Post List
    registerRequest().loadend(_ => {
      addFlagInPostList()
      //  翻墙, 延迟太高
      setTimeout(() => {
        addFlagInPostList()
      }, 300)
    })
    if (window.location.href.includes('/comments/')) {
      removeADInPostDetail()
    } else {
      //  翻墙, 延迟太高
      setTimeout(() => {
        addFlagInPostList()
      }, 300)
    }
    updateStyle()
  }
  function updateStyle() {
    if (HideFlag) {
      document.head.insertAdjacentHTML(
        'beforeend',
        `<style>.${FlagClassName}{${
          Dim ? 'opacity:0.1' : 'display:none'
        }}}</style>`,
      )
    }
    if (HideAD) {
      document.head.insertAdjacentHTML(
        'beforeend',
        `<style>.${ADFlagClassName}{${
          Dim ? 'opacity:0.1}' : 'display:none'
        }}</style>`,
      )
    }
  }
  //  监听网络请求
  function registerRequest() {
    let _loadend
    const option = {
      loadend: loadend => {
        _loadend = loadend
      },
    }
    ;(function () {
      var origOpen = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function (_method, _url) {
        this.addEventListener('loadend', () => {
          _loadend === null || _loadend === void 0 ? void 0 : _loadend(_url)
        })
        origOpen.apply(this, arguments)
      }
    })()
    return option
  }
  //  移除广告
  function addFlagInPostList() {
    var _a, _b
    const list = document.querySelector(`.${PostListClassName}`)
    if (!list) return
    for (const card of list.children) {
      if (card.classList) {
        if (card.classList.contains('flowed')) continue
        const classList =
          (_b =
            (_a = card.children[0]) === null || _a === void 0
              ? void 0
              : _a.children[0]) === null || _b === void 0
            ? void 0
            : _b.classList
        if (classList) {
          //  移除广告
          if (classList.toString().length > 1000) {
            card.classList.add(FlagClassName)
          }
          //  根据关键词为对应的 POST 添加 flag
          const titleH3 = card.querySelector(`.${PostClassName}`)
          if (titleH3) {
            for (const word of BlockKeyWords) {
              if (titleH3.innerHTML.includes(word)) {
                card.classList.add(FlagClassName)
              }
            }
          }
          card.classList.add('flowed')
        } else {
          // some holder exist
        }
      }
    }
  }
  //  移除正文中的广告
  function removeADInPostDetail() {
    onceFind({
      timeout: 10000,
      ms: 100,
      id: 'removeADInDetail.findContent',
      action: () => document.querySelector('div.uI_hDmU5GSiudtABRz_37'),
    })
      .then(parent => {
        onceFind({
          timeout: 20000,
          ms: 100,
          id: 'removeADInDetail.removeAD',
          action: () => {
            for (const el of parent.children) {
              if (
                el.classList.length === 0 &&
                el.attributes.length === 0 &&
                el.tagName === 'DIV'
              ) {
                return el
              }
            }
            return null
          },
        })
          .then(el => {
            console.log('[fq_check_keywords] AD removed in post content')
            el.classList.add(FlagClassName)
          })
          .catch(info => {
            console.log(info)
          })
      })
      .catch(info => {
        console.log(info)
      })
  } // CONCATENATED MODULE: ./src/site.ts

  ;(function () {
    'use strict'
    // GM_addStyle(GM_getResourceText('customCSS'))
    Main()
  })()

  /******/
})()
