# 看了就能懂的 vue2 diff 算法
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
## diffAttr
```js
function diffAttr(oldVnode = {}, vnode = {}, parentElm) {
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