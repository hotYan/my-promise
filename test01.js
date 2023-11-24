
// ① Promise 的基本用法（resolve 方法、reject 方法、then 方法）
const MyPromise = require('./promise01')
const p = new MyPromise((resolve, reject) => {
  // resolve('success') // ①
  reject('filed') // ②
  // throw Error('executor 中抛出错误') // ③
})
p.then((value) => {
  console.log('fulfilled1:', value) // 执行① fulfilled1: success
}, (reason) => {
  console.log('rejected1:', reason)
  // 执行② rejected1: filed
  // 执行③ rejected1: Error: executor 中抛出错误
})
p.then((value) => {
  console.log('fulfilled2:', value) // fulfilled2: success
}, (reason) => {
  console.log('rejected2:', reason)
  // 执行② rejected2: filed
  // 执行③ rejected2: Error: executor 中抛出错误
})

