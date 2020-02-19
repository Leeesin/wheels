export function appendChildren(parentElm, childVnodes) {
  childVnodes.forEach(childVnode => {
    parentElm.appendChild(childVnode.render())
  });
}

export function createElm(vnode, parentElm, refElm) {
  if (vnode.tag) {
    insert(parentElm, document.createElement(vnode.tag), refElm);
  } else {
    insert(parentElm, document.createTextNode(vnode.text), refElm);
  }
}

export function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, refElm);
  }
}

export function removeNode(el) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

export function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch) {
      removeNode(ch.elm);
    }
  }
}

export function insert(parent, elm, ref) {
  if (parent) {
    if (ref) {
      if (ref.parentNode === parent) {
        insertBefore(parent, elm, ref);
      }
    } else {
      parent.appendChild(elm);
    }
  }
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