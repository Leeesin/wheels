// const mount = require('./mount')

class Vnode {
  constructor(tag = '', attr = {}, children = []) {
    this.tag = tag
    this.attr = attr
    this.children = children
  }

  render() {
    const el = document.createElement(this.tag) // 根据tagName构建
    const attr = this.attr

    Object.keys(attr).forEach(propName => {
      const propValue = attr[propName]
      el.setAttribute(propName, propValue)
    })

    const children = this.children || []

    children.forEach(function (child) {
      var childEl = (child instanceof Vnode)
        ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
        : document.createTextNode(child) // 如果字符串，只构建文本节点
      el.appendChild(childEl)
    })
    return el
  }

}

export default Vnode
