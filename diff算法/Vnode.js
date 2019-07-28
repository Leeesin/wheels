class Vnode {
  constructor(tag = '', attr = {}, children = []) {
    this.tag = tag
    this.attr = attr
    this.children = children
  }

  render() {
    const elm = document.createElement(this.tag) // 根据tagName构建
    const attr = this.attr

    Object.keys(attr).forEach(propName => {
      const propValue = attr[propName]
      elm.setAttribute(propName, propValue)
    })

    const children = this.children || []

    children.forEach(function (child) {
      var childEl = (child instanceof Vnode)
        ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
        : document.createTextNode(child) // 如果字符串，只构建文本节点
      elm.appendChild(childEl)
    })
    this.elm = elm
    this.elm.vnode = this
    return elm
  }

}

export default Vnode
