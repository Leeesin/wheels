function cloneDeep(obj, hash = new WeakMap()) { // 递归拷贝
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj === null || typeof obj !== 'object') {
    // 如果不是复杂数据类型，直接返回
    return obj;
  }
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  /**
   * 如果 obj 是数组，那么 obj.constructor 是 [Function: Array]
   * 如果 obj 是对象，那么 obj.constructor 是 [Function: Object]
   */
  let t = new obj.constructor();
  hash.set(obj, t);
  for (let key in obj) {
    // 递归
    if (obj.hasOwnProperty(key)) {// 是否是自身的属性
      t[key] = cloneDeep(obj[key], hash);
    }
  }
  return t;
}


var a = {
  arr: [1, 2, 3, { key: '123' }],//数组测试
};
a.self = a;//循环引用测试 
a.common1 = { name: 'ccc' };
a.common2 = a.common1;//相同引用测试
var c = cloneDeep(a);
c.common1.name = 'changed';
console.log(c);


