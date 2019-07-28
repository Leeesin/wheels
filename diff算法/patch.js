import { each, setAttr, nodeOps } from "./utils.js";

function patchVnode(parentElm, oldVnode, newVnode) {
  patchAttr(parentElm, oldVnode.attr, newVnode.attr)
  if (oldVnode.children.length) {
    if (!newVnode.children.length) {//移除  所有子节点
      nodeOps.removeChildren(oldVnode)
    } else {
      updateChildren(parentElm, oldVnode.children, newVnode.children)
    }

  } else {//旧树没有子节点,
    // 新树有子节点， 则 appendChild
    newVnode.children.length &&
      nodeOps.appendChildren(parentElm, newVnode.children)
  }

  return parentElm

}

function patchAttr(parentElm, oldTreeAttr = {}, newTreeAttr = {}) {
  each(oldTreeAttr, (key, val) => { //遍历  oldTreeAttr 看newTreeAttr 是否还有对应的属性
    if (newTreeAttr[key]) {
      val !== newTreeAttr[key] && setAttr(parentElm, key, newTreeAttr[key])
    }
    else {
      parentElm.removeAttribute(key)
    }
  })

  each(newTreeAttr, (key, val) => {//看 oldTreeAttr 是否还有对应的属性，没有就新增 
    !oldTreeAttr[key] && setAttr(parentElm, key, val)
  })
}

function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];

  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx, idxInOld, elmToMove, refElm;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    }

    else if (sameVnode(oldStartVnode, newStartVnode)) { //旧首 和 新首相同
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }

    else if (sameVnode(oldEndVnode, newEndVnode)) { //旧尾 和 新尾相同
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }

    else if (sameVnode(oldStartVnode, newEndVnode)) { //旧首 和 新尾相同,将旧首移动到 最后面
      patchVnode(oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)//将 旧首 移动到最后一个节点后面
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }

    else if (sameVnode(oldEndVnode, newStartVnode)) {//旧尾 和 新首相同 ,将 旧尾 移动到 最前面
      patchVnode(oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }

  }


}

function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}

export default function patch(parentElm, oldVnode, newVnode) {
  patchVnode(parentElm, oldVnode, newVnode)
  parentElm.vnode = newVnode//patch 更新完成真实dom后, 重置 parentElm.vnode
}