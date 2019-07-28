import * as nodeOps from "./nodeOps.js";

function each(obj, fn) {//遍历对象
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    console.error('只能遍历对象！')
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      fn(key, val)
    }
  }
}

function setAttr(node, key, value) {
  switch (key) {
    case 'style':
      each(value, (key, val) => {
        node.style[key] = val
      })
      break
    case 'value':
      var tag = node.tag || ''
      tag = tag.toLowerCase()
      if (
        tag === 'input' || tag === 'textarea'
      ) {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

export { each, setAttr, nodeOps }