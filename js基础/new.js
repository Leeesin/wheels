function new2(constructor, ...args) {
  const target = {}
  target.__proto__ = constructor.prototype
  const res = constructor.apply(target, args)
  return (typeof res === 'object' && res !== null) ? res : target
}

function People(name) {
  this.name = name
}

function People2(name) {
  this.name = name
  return {
    a: 1
  }
}

const people = new2(People, '老王')
const people2 = new2(People2, '老王')
console.log("TCL: people2", people2)




