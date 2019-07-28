export function appendChildren(parentElm, childVnodes) {
  childVnodes.forEach(childVnode => {
    parentElm.appendChild(childVnode.render())
  });


}

//移除 所有子 virtual node   和 所有子 真实 node
export function removeChildren(parentVnode) {
  const parentElm = parentVnode.elm
  parentVnode.children = []
  const childNodes = Array.from(parentElm.childNodes)
  for (const child of childNodes) {
    parentElm.removeChild(child)
  }
}

export function insertBefore(parentElm, newItem, existingItem) {
  parentElm.insertBefore(newItem, existingItem)
}


export function insertAfter(newEl, targetEl) {
  const parentEl = targetEl.parentNode;

  if (parentEl.lastChild == targetEl) {
    parentEl.appendChild(newEl);
  } else {
    parentEl.insertBefore(newEl, targetEl.nextSibling);
  }
}