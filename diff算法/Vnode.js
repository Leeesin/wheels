import { setAttr } from "./utils.js";

class Vnode {
  constructor(tag = '', attr = {}, children = [], text = '') {
    this.tag = tag
    this.attr = attr
    this.children = children
    this.text = text//如果该值 存在,则表明是文本节点
  }

  render() {
    if (this.text) return this.renderText()

    const elm = document.createElement(this.tag) // 根据tagName构建
    const attr = this.attr

    Object.keys(attr).forEach(propName => {
      const propValue = attr[propName]
      setAttr(elm, propName, propValue)
    })
    const children = this.children || []
    children.forEach(function (child) {
      const childEl = child.render()
      elm.appendChild(childEl)
    })
    this.elm = elm
    this.elm.vnode = this
    return elm
  }

  renderText() {
    const elm = document.createTextNode(this.text)
    this.elm = elm
    this.elm.vnode = this
    return elm
  }

}

export default Vnode
