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

export default each