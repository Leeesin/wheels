import { each } from "./utils.js";
function patch(oldTreeEl, oldTree, newTree) {
  patchAttr(oldTreeEl, oldTree.attr, newTree.attr)

}

function patchAttr(oldTreeEl, oldTreeAttr = {}, newTreeAttr = {}) {
  each(oldTreeAttr, (key, value => {//遍历  oldTreeAttr 看newTreeAttr 是否还有对应的属性
    if (newTreeAttr[key]) {
      value !== newTreeAttr[key] && oldTreeEl.setAttribute(key, newTreeAttr[key])
    }
    else {
      oldTreeEl.removeAttribute(key)
    }
  }))

  each(newTreeAttr, (key, value => {//看 oldTreeAttr 是否还有对应的属性，没有就新增 有就修改或者不做操作
    if (newTreeAttr[key]) {
      value !== newTreeAttr[key] && oldTreeEl.setAttribute(key, newTreeAttr[key])
    }
    else {
      oldTreeEl.removeAttribute(key)
    }
  }))

}



export default patch