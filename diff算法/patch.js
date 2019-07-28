import { each, setAttr, nodeOps } from "./utils.js";

function patch(oldTreeEl, oldTree, newTree) {
  patchAttr(oldTreeEl, oldTree.attr, newTree.attr)
  if (oldTree.children.length) {
    if (!newTree.children.length) {//移除  所有子节点
      nodeOps.removeChildren(oldTree)
    } else {
      patchChildren(oldTreeEl, oldTree.children, newTree.children)
    }

  } else {//旧树没有子节点,
    // 新树有子节点， 则 appendChild
    newTree.children.length &&
      nodeOps.appendChildren(oldTreeEl, newTree.children)
  }

  return oldTreeEl

}

function patchAttr(oldTreeEl, oldTreeAttr = {}, newTreeAttr = {}) {
  each(oldTreeAttr, (key, val) => { //遍历  oldTreeAttr 看newTreeAttr 是否还有对应的属性
    if (newTreeAttr[key]) {
      val !== newTreeAttr[key] && setAttr(oldTreeEl, key, newTreeAttr[key])
    }
    else {
      oldTreeEl.removeAttribute(key)
    }
  })

  each(newTreeAttr, (key, val) => {//看 oldTreeAttr 是否还有对应的属性，没有就新增 
    !oldTreeAttr[key] && setAttr(oldTreeEl, key, val)
  })
}

function patchChildren(oldTreeEl, oldChildren, newChildren) {

}


export default patch