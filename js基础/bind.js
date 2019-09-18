function bind2(fn, ctx) {
  

}

function test() {
    console.log('this.name 的值是：', this.name);
}

const obj = {
  name: '1'
}

bind2(test, obj)