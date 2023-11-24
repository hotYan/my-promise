
/**
 * Promise 实现异步调用
 * new Promise((resolve,reject)=>{})
 * ① Promise 传入一个 executor 立即执行函数；
 * ② executor 接收两个参数：resolve 函数和 reject 函数；
 * Promise 有三个状态：pending、fulfilled、rejected；
 * ① 状态只能从 pending => fulfilled，pending => rejected；
 * ② 状态一旦确认，就不会再改变；
 * Promise 都有 then 方法
 * ① 接收两个可选参数：成功的回调 onFulfilled、失败的回调 onRejected；
 * ② then 可以在同一个 Promise 上多次调用；
 * Promise 的异步调用（发布订阅模式）
 * ① 在 then 方法中订阅（收集成功或失败的回调）
 * ② 在 resolve 方法中发布成功的回调（依次执行成功地回调函数）
 * ③ 在  reject 方法中发布失败的回调（依次执行失败的回调函数）
 */
const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Rejected = 'rejected'
class MyPromise {
  constructor(executor) { // promise 传入一个 executor 立即执行函数
    // 定义在实例上的属性和方法，实例独有
    this.state = Pending // 状态
    this.value = undefined // 任何合法的js值（undefined、thenable：定义then方法的对象或函数、promise）
    this.reason = undefined // 一个表示 promise 被reject 的原因
    this.onFulfilledCallbacks = [] // 存成功回调的数组
    this.onRejectedCallbacks = [] // 存失败回调的数组

    const resolve = (value) => {
      if (this.state === Pending) {
        this.state = Fulfilled
        this.value = value
        // 异步的情况发布订阅模式
        // 发布：执行成功的回调
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (this.state === Pending) {
        this.state = Rejected
        this.reason = reason
        // 异步的情况发布订阅模式
        // 发布：执行失败的回调
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try { // 执行器抛出错误
      executor(resolve, reject)// executor 有两个入参：resolve 函数和 reject 函数
    } catch (e) { // 捕获异常，直接reject
      reject(e)
    }
  }
  // 定义在原型 prototype 上的方法或属性,所有实例共享（继承同一个）
  then(onFulfilled, onRejected) {
    if (this.state === Fulfilled) {
      onFulfilled(this.value)
    }
    if (this.state === Rejected) {
      onRejected(this.reason)
    }
    // 异步的情况发布订阅模式
    // 订阅：收集成功或失败的回调
    if (this.state === Pending) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = MyPromise
