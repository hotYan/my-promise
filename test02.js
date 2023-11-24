
// ② Promise 的异步调用
const MyPromise = require('./promise02')
const p = new MyPromise((resolve, reject) => {
  // 非异步
  // resolve('success')
  // reject('filed')
  // 异步
  setTimeout(() => {
    resolve('success')
    // reject('filed')
  }, 2000)
})
p.then((value) => {
  console.log('fulfilled1:', value)
}, (reason) => {
  console.log('rejected1:', reason)
})
p.then((value) => {
  console.log('fulfilled2:', value)
}, (reason) => {
  console.log('rejected2:', reason)
})
// resolve('success')
// 2秒后打印：
// fulfilled1: success
// fulfilled2: success

// reject('filed')
// 2秒后打印：
// rejected1: filed
// rejected2: filed

