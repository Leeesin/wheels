import { each, setAttr, nodeOps, isUndef, isDef, createKeyToOldIdx } from "./utils.js";
import patchAttr from "./patchAttr.js";

function patchVnode(parentElm, oldVnode, vnode) {
  if (vnode.text) { //文本节点
    parentElm.textContent = vnode.text
    return
  }

  patchAttr(oldVnode.attr, vnode.attr, parentElm)

  if (oldVnode.children && oldVnode.children.length) {
    if (!vnode.children.length) {//移除  所有子节点
      nodeOps.removeChildren(oldVnode)
    } else {
      updateChildren(parentElm, oldVnode.children, vnode.children)
    }

  } else {//旧树没有子节点,
    // 新树有子节点， 则 appendChild
    vnode.children && vnode.children.length &&
      nodeOps.appendChildren(parentElm, vnode.children)
  }
  parentElm.vnode = vnode//patch 更新完成真实dom后, 重置 parentElm.vnode
  return parentElm
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
      patchVnode(oldStartVnode.elm, oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }

    else if (sameVnode(oldEndVnode, newEndVnode)) { //旧尾 和 新尾相同
      patchVnode(oldEndVnode.elm, oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }

    else if (sameVnode(oldStartVnode, newEndVnode)) { //旧首 和 新尾相同,将旧首移动到 最后面
      patchVnode(oldStartVnode.elm, oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)//将 旧首 移动到最后一个节点后面
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }

    else if (sameVnode(oldEndVnode, newStartVnode)) {//旧尾 和 新首相同 ,将 旧尾 移动到 最前面
      patchVnode(oldEndVnode.elm, oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }

    else {//首尾对比 都不 符合 sameVnode 的话
      //1. 尝试 用 newCh 的第一项在 oldCh 内寻找 sameVnode
      let elmToMove = oldCh[idxInOld];
      if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
      if (!idxInOld) {//如果 oldCh 不存在 sameVnode 则直接创建一个
        nodeOps.createElm(newStartVnode, parentElm);
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (sameVnode(elmToMove, newStartVnode)) {
          patchVnode(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          nodeOps.createElm(newStartVnode, parentElm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    refElm = (newCh[newEndIdx + 1]) ? newCh[newEndIdx + 1].elm : null;
    nodeOps.addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    nodeOps.removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }


}

function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}

export default function patch(oldVnode, vnode, parentElm) {
  patchVnode(parentElm, oldVnode, vnode)
}