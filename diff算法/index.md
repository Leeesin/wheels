# 解析 vue2 diff 算法
## 首先我们先整明白 diff 算法的本质
> diff算法的本质是用来找出两个对象之间的差异

此处说到的对象其实就对应 vue中的 virtual dom,即使用 js 对象来表示页面中的 dom 结构。
``` html
 <div id='app'>
   <span id='child'>1</span>
 </div>
```
其实仔细思考下，一个dom节点主要包含三个部分
1. 自身的标签名（div）
2. 自身的属性（id='app'）
3. 子节点(span)

所以我们可以设计如下的对象结构表示一个 dom 节点

```js
const vnode = {
  tag:'div',
  attrs:{id:'app'},
  children:[{ tag:'span',attrs:{id:'child'},children:['1']}]
} 
```
当用户对界面进行操作，比如把 div 的 id 改为 app2 ,将子节点 span 的文本子节点 1 改为 2,那么我们可以得到如下 vnode
```js
const vnode2 = {
  tag:'div',
  attrs:{id:'app2'},
  children:[{ tag:'span',attrs:{id:'child'},children:['2']}]
} 
```
上文说了这个结论,再看下
> diff算法的本质是用来找出两个对象之间的差异

那么我们运行 diff (vnode,vnode2),就能知道 vnode 和 vnode2 之间的差异如下：
- div 的 id 改为 app2
- span 的文本子节点 1 改为 2

知道了差异部分，我们就能更新视图了,伪代码如下
```js
document.getElementById("app").setAttribute('id', 'app2')// id 改为 app2
document.getElementById("child").firstChild.textContent ='2' //1 改为 2

```
## 再思考下,当我们改变一个节点的时候，我们其实主要改了以下部分
- 自身的属性（style 、class等等）
- 子节点
  
那么 diff 算法可以抽象为 两部分
```js
function diff(vnode,newVnode){
  diffAttr(vnode.attr,newVnode.attr)
  diffChildren(vnode.children,newVnode.children)
}
``` 
>vue之前的源码是采用 先 diff，得到差异，然后根据差异在去 patch 真实 dom，也就是分两步骤
1. diff
2. patch

但是这样性能会有损失,因为 diff 过程中会遍历一次整棵树，patch 的时候又会遍历整棵树,其实这两次遍历可以合并成一次，也就是 `在diff的同时进行patch`

所以我们把流程改为
```js
function patchVnode(oldVnode, vnode, parentElm){
  patchAttr(oldVnode.attr, vnode.attr, parentElm)
  patchChildren(parentElm, oldVnode.children, vnode.children)
}
```
## patchAttr
```js
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
```
> 该函数主要做了两件事
1. 遍历  oldVnode 看 newTreeAttr 是否还有对应的属性
   - 如果有并且不相等的，修改对应的属性， 
   - 没有的话，直接删除对应的属性
2. 遍历oldVnode, 是否还有对应的属性，没有就新增 

## diffChildren
先看下源码
```js
function patchChildren(parentElm, oldCh, newCh) {
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
```


>上述代码的本质是找出两个数组的差异

举个栗子

旧数组   `[a,b,c,d]`

新数组   `[e,f,g,h]`

怎么找出新旧数组之间的差异呢？
我们约定以下名词
- 旧首（旧数组的第一个元素）
- 旧尾（旧数组的最后一个元素）
- 新首（新数组的第一个元素）
- 新尾（新数组的最后一个元素）

一些工具函数
- sameVnode--用于判断节点是否应该复用,这里做了一些简化，实际的diff算法复杂些，这里只用tag 和 key 相同，我们就复用节点，执行patchVnode，即对节点进行修改
```js
function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}
```
- createKeyToOldIdx--建立key-index的索引,主要是替代遍历，提升性能 
```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```

1. 旧首 和 新首 对比
```js
if (sameVnode(oldStartVnode, newStartVnode)) { 
      patchVnode(oldStartVnode.elm, oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
```
2. 旧尾 和 新尾 对比
``` js
if (sameVnode(oldEndVnode, newEndVnode)) { //旧尾 和 新尾相同
      patchVnode(oldEndVnode.elm, oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
```
3. 旧首 和 新尾 对比
```js
if (sameVnode(oldStartVnode, newEndVnode)) { //旧首 和 新尾相同,将旧首移动到 最后面
      patchVnode(oldStartVnode.elm, oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
```

4. 旧尾 和 新首 对比,将 旧尾 移动到 最前面
```js
 if (sameVnode(oldEndVnode, newStartVnode)) {//旧尾 和 新首相同 ,将 旧尾 移动到 最前面
      patchVnode(oldEndVnode.elm, oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
```
5. 首尾对比 都不 符合 sameVnode 的话
   -  尝试 用 newCh 的第一项在 oldCh 内寻找 sameVnode,如果在 oldCh 不存在对应的 sameVnode ，则直接创建一个，存在的话则判断
      - 符合 sameVnode，则移动  oldCh 对应的 节点
      - 不符合 sameVnode ,创建新节点

6. 通过 oldStartIdx > oldEndIdx ，来判断 oldCh 和  newCh 哪一个先遍历完成
   - oldCh 先遍历完成,则证明 newCh 还有多余节点，需要`新增`这些节点
   - newCh 先遍历完成,则证明 oldCh 还有多余节点，需要`删除`这些节点

## 总结
- diff 算法的本质是`找出两个对象之间的差异`
- diff 算法的核心是`子节点数组对比`,思路是通过 `首尾两端对比`
- key 的作用 主要是
    - 决定节点是否可以复用
    - 建立key-index的索引,主要是替代遍历，提升性能 