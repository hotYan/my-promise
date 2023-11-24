
const MyPromise = require('./promise')

const p1 = new MyPromise((resolve, reject) => {
  resolve('p1')
})

const p2 = p1.then(() => {
  // return new Error('error') // resolve: Error: error
  // return Promise.resolve('promise.resolve') // resolve: promise.resolve
  return new MyPromise((resolve, reject) => {
    // resolve('p2') // resolve: p2
    setTimeout(() => {
      // resolve('MyPromise') // 2秒后 resolve: MyPromise
      resolve(new MyPromise((resolve, reject) => {
        resolve('多层嵌套返回 resolve') // 2 秒后 resolve: 多层嵌套返回 resolve
      }))
    }, 2000)
  })
})
p2.then((value) => {
  console.log('resolve:', value)
}, (value) => {
  console.log('reject:', value)
})

// // resolve 测试
// Promise.resolve().then(() => {
//   console.log(0)
// }).then(() => {
//   console.log(2)
//   resolve(2)
// }).then(() => {
//   console.log(4)
// }).then(() => {
//   console.log(6)
//   resolve(6)
// }).then(() => {
//   console.log(8)
// })
// Promise.resolve(1).then(() => {
//   console.log(1)
// }).then(() => {
//   console.log(3)
//   resolve(3)
// }).then(() => {
//   console.log(5)
// }).then(() => {
//   console.log(7)
//   resolve(7)
// }).then(() => {
//   console.log(9)
// })
// MyPromise 0 2 4 6 8 1 3 5 7 9
// Promise   0 1 2 3 4 5 6 7 8 9

// MyPromise.resolve().then(() => {
//   console.log(0)
//   return Promise.resolve(4)
// }).then((res) => {
//   console.log(res)
// })

// MyPromise.resolve().then(() => {
//   console.log(1)
// }).then(() => {
//   console.log(2)
// }).then(() => {
//   console.log(3)
// }).then(() => {
//   console.log(5)
// }).then(() => {
//   console.log(6)
// })
// MyPromise 0 4 1 2 3 5 6
// Promise   0 1 2 3 4 5 6

// // call 测试
// const p1 = new MyPromise(resolve => {
//   resolve(4)
// })
// MyPromise.all([1, 2, 3, p1]).then(value => {
//   console.log(value)
// }, reason => {
//   console.log(reason)
// })

// MyPromise.resolve().then(() => {
//   return 1
// }).then((value) => {
//   console.log('1', value)
// })

// ？？？？？？
// MyPromise.resolve().then(() => {
//   console.log('MyPromise.resolve(2)', MyPromise.resolve(2))
//   return MyPromise.resolve(2)
// }).then((value) => {
//   console.log('2', value)
// })
// Promise.resolve().then(() => {
//   console.log('Promise.resolve(22)', Promise.resolve(22))
//   return Promise.resolve(22)
// }).then((value) => {
//   console.log('22', value)
// })
// new MyPromise(resolve => {
//   console.log('MyPromise.resolve(3)', MyPromise.resolve(3))
//   resolve(MyPromise.resolve(3))
// }).then((value) => {
//   console.log('3', value)
// })
// new Promise(resolve => {
//   console.log('Promise.resolve(33)', Promise.resolve(33))
//   resolve(Promise.resolve(33))
// }).then((value) => {
//   console.log('33', value)
// })

// MyPromise.resolve().then(() => {
//   return new MyPromise(resolve => {
//     resolve(4)
//   })
//     .then(res => {
//       console.log(res, 'then4_1')
//       return 4.1
//     })
//     .then(res => {
//       console.log(res)
//       return 4.2
//     })
// })
//   .then(res => {
//     console.log(res, 'then4_2')
//   })

// MyPromise.resolve().then(() => {
//   console.log(1)
// }).then(() => {
//   console.log(2)
// }).then(() => {
//   console.log(3)
// }).then(() => {
//   console.log(5)
// }).then(() => {
//   console.log(6)
// })

// const p1 = Promise.resolve().then(() => {
//   return 4
// })
// const p2 = MyPromise.resolve().then(() => {
//   return MyPromise.resolve(4)
// })
// p1.then(value => {
//   console.log('p1', value)
// })

// p2.then().then(value => {
//   console.log('p2', value)
// })
// Promise.resolve().then(() => {
//   console.log(1)
// }).then(() => {
//   console.log(2)
// }).then(() => {
//   console.log(3)
// }).then(() => {
//   console.log(5)
// }).then(() => {
//   console.log(6)
// })
