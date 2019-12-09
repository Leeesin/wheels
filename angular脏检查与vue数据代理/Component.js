class Component {
  constructor() {
    // this.patch()
    this.$$watchers = [];         //监听器
  }

  patch() {
    const setTimeoutCopy = setTimeout
    window.setTimeout = (fn, wait) => {
      let fn2 = () => {
        fn()
        this.update()
      }
      console.log('this.setTimeoutCopy 的值是：', this.setTimeoutCopy);
      setTimeoutCopy(fn2, wait)
    }
  }

  watch(name, exp, listener) {
    this.$$watchers.push({
      name: name,                              //数据变量名
      last: '',                                //数据变量旧值
      newVal: exp,                             //返回数据变量新值的函数
      listener: listener || function () { }       //监听回调函数，变量“脏”时触发
    })
  }

  timeout(fn, wait) {
    setTimeout(() => {
      fn()
      this.update()
    }, wait);
  }


  update() {
    console.log('update');
    let bindList = document.querySelectorAll("[ng-bind]");      //获取所有含ng-bind的DOM节点
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (let i = 0; i < this.$$watchers.length; i++) {
        let newVal = this.$$watchers[i].newVal();
        let oldVal = this.$$watchers[i].last;

        if (newVal !== oldVal && !isNaN(newVal) && !isNaN(oldVal)) {
          dirty = true;
          this.$$watchers[i].listener(oldVal, newVal);
          this.$$watchers[i].last = newVal;
          for (let j = 0; j < bindList.length; j++) {
            //获取DOM上的数据变量的名称
            let modelName = bindList[j].getAttribute("ng-bind");
            //数据变量名相同的DOM才更新
            if (modelName == this.$$watchers[i].name) {
              if (bindList[j].tagName == "INPUT") {
                //更新input的输入值
                bindList[j].value = this[modelName];
              }
              else {
                //更新非交互式DOM的值
                bindList[j].innerHTML = this[modelName];
              }
            }
          }
        }
      }
    }
  }

  render() {
    const ctx = this
    let bindList = document.querySelectorAll("[ng-click]");
    for (let i = 0; i < bindList.length; i++) {

      bindList[i].addEventListener('click', (function (index) {
        return function () {
          ctx[bindList[index].getAttribute("ng-click")]();
          ctx.update();           //调用函数时触发update
        }
      })(i))
    }

    let inputList = document.querySelectorAll("input[ng-bind]");
    for (let i = 0; i < inputList.length; i++) {
      inputList[i].addEventListener("input", (function (index) {
        return function () {
          ctx[inputList[index].getAttribute("ng-bind")] = inputList[index].value;
          ctx.update();           //调用函数时触发update
        }
      })(i));
    }

    //绑定数据
    for (let key in ctx) {
      if (key != "$$watchers" && typeof ctx[key] != "function") {            //非函数数据才进行绑定
        ctx.watch(key, () => ctx[key])
      }
    }
    this.update();
  }
}

export default Component