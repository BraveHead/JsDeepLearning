
// 手写实现一个 Promise A+ 规范函数
/**
 * 1. 拥有一个then方法的对象或者函数
 * 2. resolve 和 reject 可以传入任何js的合法的值
 * 3.  pending、fulfilled、rejected
 * 4. then 接受两个参数 onFulfilled 和 onRejected， 连个都可选
 * 5. onFulfilled 会在 Promise被 fulfilled 时调用， onRejected 会在 Promise 被 rejected 调用
 * 6. then方法必须返回一个新的 Promise 对象。
 * 7. onFulfilled和onRejected，返回普通值 ，则新返回的promise应该以这个值被fulfilled.
 * 8. onFulfilled和onRejected，返回Promise或者Thenable, 那么新返回的Promise应该采用这个返回对象的状态。例如，如果返回的 Promise 被fulfilled，那么新 Promise 也被fulfilled，并且值相同；如果返回的 Promise 被rejected，新 Promise 也被rejected，并且原因相同。?
 * 9. 错误处理: 如果onRejected函数在执行过程中抛出一个异常，那么新返回的 Promise 应该以这个异常为原因被rejected。 如果在 Promise 的执行过程中（例如在resolve或reject函数内部）同步抛出一个异常，那么这个 Promise 应该立即以这个异常为原因被rejected ? 
 */
(() => {
   const PENDING = 'pending';
   const FULFILLED = 'fulfilled';
   const REJECTED = 'rejected';

   function MyPromise(executor) {
        let self = this
        self.status = PENDING
        self.value = undefined
        self.reason = undefined
        self.onFulfilledCallbacks = []
        self.onRejectedCallbacks = []

        function resolve(value) {
            if(self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onFulfilledCallbacks.forEach(callback => callback(self.value))
            }
            console.log('resolve:', self.status, self.value);
        }

        function reject(reason) {
            if(self.status === PENDING) {
                self.status = REJECTED
                self.reason = reason
                self.onRejectedCallbacks.forEach(callback => callback(self.reason))
            }
        }


        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

   }

   MyPromise.prototype.Resolve = function(state) {
    
    let promise2 = new MyPromise((resolve, reject)=> {
        resolve(state);
    });

    return promise2.value
   }

   MyPromise.prototype.then = function(onFulfilled, onRejected) {
        let self = this
        let promise2;

        onFulfilled = typeof onFulfilled ==='function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        if(self.status === PENDING) {
            promise2 = new MyPromise((resolve, reject) => {
                self.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(self.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })

                self.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(self.reason);
                            resolve(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0)
                })
            })
        }

        if(self.status === FULFILLED) {
            promise2 = MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                    
                }, 0)
            })
        }

        if(self.status === REJECTED) {
            promise2 = MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                       let x = onRejected(self.reason);
                       resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0)
            })
        }

        return promise2

   }


   function resolvePromise (promise, x, resolve, reject) {
        // if(promise === x) {
        //     return reject(new TypeError('循环引用错误'));
        // }
        // let called = false;
        // if(x && (typeof x === 'object' || typeof x === 'function')) {
        //     try {
        //         let then = x.then;
        //         if(typeof then === 'function') {
        //             then.call(x, y => {
        //                 resolvePromise(promise, y, resolve, reject)
        //             }, r => {
        //                 reject(r)
        //             })
        //         } else {
        //             resolve(x);
        //         }
        //     } catch (error) {
        //         reject(error);
        //     }
        // } else {
        //     resolve(x)
        // }
 
        if(x && (typeof x === 'object' || typeof x === 'function') ) {
            let then = x.then;
            if(typeof then === 'function' ) {   
                resolvePromise(promise ,x.then , resolve, reject );
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }

       
   }


   new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('测试成功');
        }, 1000);
   }).then(newResult => {
    console.log('newResult:', newResult, MyPromise, MyPromise.prototype.Resolve);
    return MyPromise.prototype.Resolve(222)
   }).then(res => {
    console.log('res:', res);
   })


   new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
   }).then(() => {
        return Promise.resolve(2);
   }).then(res => {
    console.log('res1:', res);
   })




})()
