import { onceFind } from './once'

//  🚧🔧🔩🧱 关键词
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
//  🚧🔧🔩🧱 隐藏方式
const Dim = false

const FlagClassName = 'FQKill'
const ADFlagClassName = 'FQADKill'
const PostListClassName = 'rpBJOHq2PR60pnwJlUyP0'
const PostClassName = '_eYtD2XCVieq6emjKBH3m'

export function Main() {
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
  let _loadend: (url: string) => void | null | undefined
  const option = {
    loadend: (loadend: (url: string) => void) => {
      _loadend = loadend
    },
  }

  ;(function () {
    var origOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      _method: string,
      _url: string,
    ) {
      this.addEventListener('loadend', () => {
        _loadend?.(_url)
      })
      origOpen.apply(this, arguments)
    }
  })()

  return option
}

//  移除广告
function addFlagInPostList() {
  const list = document.querySelector<HTMLDivElement>(`.${PostListClassName}`)
  if (!list) return
  for (const card of list.children) {
    if (card.classList) {
      if (card.classList.contains('flowed')) continue

      const classList = card.children[0]?.children[0]?.classList

      if (classList) {
        //  移除广告
        if (classList.toString().length > 1000) {
          card.classList.add(FlagClassName)
        }

        //  根据关键词为对应的 POST 添加 flag
        const titleH3 = card.querySelector<HTMLHeadElement>(`.${PostClassName}`)
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
    action: () =>
      document.querySelector<HTMLDivElement>('div.uI_hDmU5GSiudtABRz_37'),
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
}
