const oldTree = {
  tag: 'div',
  attr: {
    id: 'oldTree',
    style: { color: 'red' }
  },
  children: [
    { tag: 'div', attr: { id: 'oldTree-child-1', style: { color: 'blue' } } },
    { tag: 'div', attr: { id: 'oldTree-child-2', style: { color: 'yellow' } } }
  ]
}
const newTree = {
  tag: 'div',
  attr: {
    id: 'newTree',
    class: 'newTree-div',
    style: { color: 'white' },
  },
  children: [
    { tag: 'div', attr: { id: 'newTree-child-1', style: { color: 'blue' } } },
  ]
}

patch(oldTree, newTree)