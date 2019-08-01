import { setAttr, each } from "./utils.js";
function patchAttr(oldVnode = {}, vnode = {}, parentElm) {
  each(oldVnode, (key, val) => { //遍历  oldVnode 看newTreeAttr 是否还有对应的属性
    if (vnode[key]) {
      val !== vnode[key] && setAttr(parentElm, key, vnode[key])
    }
    else {
      parentElm.removeAttribute(key)
    }
  })

  each(vnode, (key, val) => {//看 oldVnode 是否还有对应的属性，没有就新增 
    !oldVnode[key] && setAttr(parentElm, key, val)
  })
}

export default patchAttr