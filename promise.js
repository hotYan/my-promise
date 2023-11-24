
/**
 * new Promise((resolve,reject)=>{})
 * ① Promise 传入一个 executor 立即执行函数；
 * ② executor 接收两个参数：resolve 函数和 reject 函数；
 *
 * Promise 有三个状态：pending、fulfilled、rejected；（ Promises/A+ 2.1）
 * ① 状态只能从 pending => fulfilled，pending => rejected；（ Promises/A+ 2.1.1）
 * ② 状态一旦确认，就不会再改变；（Promises/A+ 2.1.2，Promises/A+ 2.1.3）
 *
 * Promise 都有 then 方法（Promises/A+ 2.2）；
 * ① 接收两个可选函数形参：成功的回调 onFulfilled、失败的回调 onRejected；（Promises/A+ 2.2.1）
 * ② onFulfilled 和 onRejected 都是 function；（ Promises/A+ 2.2.2， Promises/A+ 2.2.3）
 * ③ onFulfilled 和 onRejected 要等到同步代码执行完后再执行；（ Promises/A+ 2.2.4）
 * ④ then 可以在同一个 Promise 上多次调用；（ Promises/A+ 2.2.6）
 * Promise 的异步调用（发布订阅模式）
 * ① 在 then 方法中订阅（收集成功或失败的回调）
 * ② 在 resolve 方法中发布成功的回调（依次执行成功地回调函数）
 * ③ 在  reject 方法中发布失败的回调（依次执行失败的回调函数）
 *
 * Promise 的链式调用
 * ① then 必须返回一个 Promise：promise2 = promise1.then(onFulfilled,onRejected)；（ Promises/A+ 2.2.7）
 * ①-① 定义 resolvePromise(promise2,x) 方法处理成功回调（onFulfilled）或失败回调（onRejected）返回的值 x；（ Promises/A+ 2.2.7.1）
 * ①-② 成功回调（onFulfilled）或失败回调（onRejected）报错，抛出错误的原因 reason；（ Promises/A+ 2.2.7.2）
 * ①-③ onFulfilled 不是 function ，直接返回 value 值；（ Promises/A+ 2.2.7.3 ）
 * ①-④ onRejected 不是 function ，抛出 reason；（ Promises/A+ 2.2.7.4 ）
 *
 * ② resolvePromise(promise2,x)；（ Promises/A+ 2.3）
 * ②-① promise2 和 x 是相同的引用，抛出 TypeError；（ Promises/A+ 2.3.1）
 * ②-② x 是 promise ，延用 x 的状态；（ Promises/A+ 2.3.2）
 * ②-③ x 是 object 或 function ；（ Promises/A+ 2.3.3）
 * ②-④ x 不是 object 或 function：resolve(x)；（ Promises/A+ 2.3.4）
 */
function resolvePromise(promise2, x, resolve, reject) {
  /* promise2 和 x 是相同的引用，抛出 TypeError；（ Promises/A+ 2.3.1）*/
  if (promise2 === x) {
    return reject(new TypeError('死循环了'))
  }
  /* x 是 object（非null）或 function；（ Promises/A+ 2.3.3 ）*/
  if ((x && typeof x === 'object') || typeof x === 'function') {
    // 只能调用一次（PromiseA+ 2.3.3.3.3）；
    let called = false
    try { // PromiseA+ 2.3.3.2
      /* PromiseA+ 2.3.3.1 */
      const then = x.then
      /* PromiseA+ 2.3.3.3；
       * then 是 function;
       * 调用 then ，x 作 this 传入，两个形参：resolvePromise、rejectPromise；
       */
      if (typeof then === 'function') {
        then.call(x, (y) => { // PromiseA+ 2.3.3.3.1
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r) => { // PromiseA+ 2.3.3.3.2
          if (called) return
          called = true
          reject(r)
        })
      } else { // PromiseA+ 2.3.3.4
        if (called) return
        called = true
        resolve(x)
      }
    } catch (e) { // PromiseA+ 2.3.3.2
      if (called) return
      called = true
      reject(e)
    }
  } else { // x 不是 object 或 function ，返回 x 的值；（ Promises/A+ 2.3.4 ）
    resolve(x)
  }
}
/* Promise 有三种状态：pending、fulfilled、rejected；（ Promises/A+ 2.1）*/
const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Rejected = 'rejected'
class MyPromise {
  constructor(executor) { // promise 传入一个 executor 立即执行函数
    // 定义在实例上的属性和方法，实例独有
    this.state = Pending // 状态
    this.value = undefined // 任何合法的js值（undefined、thenable：定义then方法的对象或函数、promise）
    this.reason = undefined // 一个表示 promise 被reject 的原因

    // then 被调用多次，存在多个成功或失败的回调函数（ Promises/A+ 2.2.6）
    this.onFulfilledCallbacks = [] // 存成功回调的数组
    this.onRejectedCallbacks = [] // 存失败回调的数组

    const resolve = (value) => {
      if (this.state === Pending) {
        this.state = Fulfilled
        this.value = value
        // 异步的情况发布订阅模式
        // 发布：执行成功的回调
        this.onFulfilledCallbacks.forEach(fn => fn()) // （ Promises/A+ 2.2.6.1）
      }
    }
    const reject = (reason) => {
      if (this.state === Pending) {
        this.state = Rejected
        this.reason = reason
        // 异步的情况发布订阅模式
        // 发布：执行失败的回调
        this.onRejectedCallbacks.forEach(fn => fn()) // （ Promises/A+ 2.2.6.2）
      }
    }
    try { // 执行器抛出错误
      executor(resolve, reject)// executor 有两个入参：resolve 函数和 reject 函数
    } catch (e) { // 捕获异常，直接reject
      reject(e)
    }
  }
  // 定义在原型 prototype 上的方法或属性,所有实例共享（继承同一个）
  /**
   * then 方法
   * 可选的两个形参；（ Promises/A+ 2.2.1 ）
   * 形参作为 function 被调用；（ Promises/A+ 2.2.5 ）
   */
  then(onFulfilled, onRejected) {
    /**
     * onFulfilled 不是 function ，直接返回 value 值；（ Promises/A+ 2.2.7.3 ）
     * onRejected 不是 function ，抛出 reason；（ Promises/A+ 2.2.7.4 ）
     */
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    // 定义 promise2 接收 then 方法返回的 promise；
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === Fulfilled) {
        setTimeout(() => { //  模拟同步代码执行后再执行； Promises/A+ 2.2.4）
          try { // onFulfilled 报错，抛出异常原因；（ Promises/A+ 2.2.7.2）
            const x = onFulfilled(this.value) // onFulfilled 返回 x 值；（ Promises/A+ 2.2.7.1）
            resolvePromise(promise2, x, resolve, reject) // 处理 x 的值；（ Promises/A+ 2.3）
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === Rejected) {
        setTimeout(() => { // 模拟同步代码执行后再执行；（ Promises/A+ 2.2.4）
          try { // onRejected 报错，抛出异常原因；（ Promises/A+ 2.2.7.2）
            const x = onRejected(this.reason) // onRejected 返回 x 值；（ Promises/A+ 2.2.7.1）
            resolvePromise(promise2, x, resolve, reject) // 处理 x 的值；（ Promises/A+ 2.3）
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      // 异步的情况发布订阅模式
      // 订阅：收集成功或失败的回调
      if (this.state === Pending) {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2 // then 方法返回一个 promise（ Promises/A+ 2.2.7）
  }
  catch(errorCallBack) {
    return this.then(null, errorCallBack)
  }
  finally(callBack) {
    return this.then(callBack, callBack)
  }
  // x 是 promise ，直接返回；
  // x 如果是 thenable，跟随 thenable 对象的状态；
  // 否则，直接 resolve(x)
  static resolve(x) {
    // x 是 promise ，返回 x；
    if (x instanceof MyPromise) {
      return x
    }
    return new MyPromise((resolve, reject) => {
      if (x && x.then && typeof x.then === 'function') {
        const then = x.then
        setTimeout(() => {
          then.call(x, resolve, reject)
        }, 0)
      } else {
        resolve(x)
      }
    })
  }
  // 直接返回 reject 理由，变成后续方法的参数
  static reject(r) {
    return new MyPromise(reject => {
      reject(r)
    })
  }
  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(iterable)) {
        const result = [] // 存储结果
        let count = 0 // 计数器
        // 长度为0 ，返回一个已经完成状态的 promise
        if (iterable.length === 0) {
          return resolve(iterable)
        }
        iterable.forEach((item, index) => {
          if (item instanceof MyPromise) {
            MyPromise.resolve(item).then(value => {
              count++
              result[index] = value
              count === iterable.length && resolve(result)
            }, reason => {
              // 存在一个失败，直接返回失败的原因
              reject(reason)
            })
          } else {
            count++
            result[index] = item // 不是 promise ，原样返回
            count === iterable.length && resolve(result)
          }
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }
}

// MyPromise.resolve = (x) => {}
// MyPromise.reject = (r) => {}
module.exports = MyPromise
