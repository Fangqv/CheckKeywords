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
  //  🚧🔧🔩🧱 关键词, 如果 POST 的 title 匹配到了对应的 keyword, 就将 POST 隐藏或变半透明
  const BlockKeyWords = [
    '俄',
    '乌',
    '哈尔科夫',
    '格鲁吉亚',
    '普京',
    '泽连斯基',
    '北约',
    '卢卡申科',
  ]
  //  🚧🔧🔩🧱 是否隐藏列表中的广告
  const HideAD = true
  //  🚧🔧🔩🧱 是否隐藏标题中存在关键词的 POST
  const HideFlag = true
  //  🚧🔧🔩🧱 隐藏方式, Dim = true 则使用 opacity:0.1 而非 display:none, 你可以使用这种方式检测那些帖子被屏蔽了
  const Dim = false

  // webpackBootstrap
  /******/ ;('use strict')

  const FlagClassName = 'FQKill'
  const ADFlagClassName = 'FQADKill'
  const PostListClassName = 'rpBJOHq2PR60pnwJlUyP0'
  const PostClassName = '_eYtD2XCVieq6emjKBH3m'
  const FlowedFlagClassName = 'FQFlowed'

  function Main() {
    updateStyle()

    //  每次进行网络请求就遍历两次 Post List
    registerRequest().loadend(_ => {
      addFlagInPostList()
      //  翻墙, 延迟太高
      setTimeout(() => {
        addFlagInPostList()
      }, 300)
    })

    if (!window.location.href.includes('/comments/')) {
      //  翻墙, 延迟太高
      setTimeout(() => {
        addFlagInPostList()
      }, 300)
    }
  }
  function updateStyle() {
    if (HideFlag) {
      document.head.insertAdjacentHTML(
        'beforeend',
        `<style>.${FlagClassName}{${
          Dim ? 'opacity:0.4' : 'display:none'
        }}}</style>`,
      )
    }
    if (HideAD) {
      document.head.insertAdjacentHTML(
        'beforeend',
        `<style>.${ADFlagClassName}{${
          Dim ? 'opacity:0.4' : 'display:none'
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
  //  添加标签
  function addFlagInPostList() {
    var _a, _b
    const list = document.querySelector(`.${PostListClassName}`)
    if (!list) return
    for (const card of list.children) {
      if (card.classList) {
        if (card.classList.contains(FlowedFlagClassName)) continue
        const classList =
          (_b =
            (_a = card.children[0]) === null || _a === void 0
              ? void 0
              : _a.children[0]) === null || _b === void 0
            ? void 0
            : _b.classList
        if (classList) {
          //  根据 reddit 广告元素的特征, 添加广告标签
          //  特征: class name 很长
          if (classList.toString().length > 1000) {
            card.classList.add(ADFlagClassName)
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
          card.classList.add(FlowedFlagClassName)
        } else {
          // some holder exist
        }
      }
    }
  }

  ;(function () {
    'use strict'
    // GM_addStyle(GM_getResourceText('customCSS'))
    Main()
  })()

  /******/
})()
