
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


})()