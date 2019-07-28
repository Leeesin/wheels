export function appendChildren(parentEl, childVnodes) {
  parentEl.vnode.children = [...childVnodes]
  childVnodes.forEach(childVnode => {
    parentEl.appendChild(childVnode.render())
  });


}

//移除 所有子 virtual node   和 所有子 真实 node
export function removeChildren(parentVnode) {
  const parentEl = parentVnode.el
  parentVnode.children = []
  const childNodes = Array.from(parentEl.childNodes)
  for (const child of childNodes) {
    parentEl.removeChild(child)
  }
}

