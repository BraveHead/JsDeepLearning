(() => {
    console.log('同步任务开始');   // 1

    // 异步任务1
    setTimeout(() => {
        // macrotask 1
        console.log('宏任务 1'); // 6
        Promise.resolve().then(() => {
            // microtask 1.1
            console.log('微任务 1.1'); // 7
        });
        setTimeout(() => {
               // macrotask 1.1
            console.log('宏任务 1.1'); // 8
        }, 0);
    }, 0);

    // micro task 1
    Promise.resolve().then(() => {
        console.log('微任务 1');  // 3
        new Promise((resolve) => {
            resolve();
            console.log('同步任务 inside new Promise'); // 4
        }).then(() => {
            // microtask 1.2
            console.log('微任务 1.2'); // 5
        });
    });

    // 异步任务2
    setTimeout(() => {
        console.log('宏任务 2'); // 9
        Promise.resolve().then(() => {
            console.log('微任务 2.1'); // 10
        });
    }, 150);

    console.log('同步任务结束'); // 2
})()

// 同步任务首先执行 所以先输出同步任务开始, 把 异步任务1在经过WebAPI后，0s后推入到宏任务队列，同步任务执行过程中遇到 Promise.then，把回调函数当做任务推入到微任务队列中，当执行到 异步任务2的时候，异步线程会等待 150ms后把宏任务2推入到 宏任务，在下一次微任务队列循环前，此时微任务队列中是['微任务 1']，宏任务队列中为【'宏任务1'】；
// eventloop microtask queue, 执行'微任务1',此时微任务队列为[], 输出'微任务 1'，再输出'同步任务 inside new Promise', 把'微任务 1.2'推入到微任务队列，继续遍历微任务队列，输出'微任务 1.2'，直至微任务所有任务遍历完。
// 现在从宏任务队列中拿出'宏任务1', 执行任务，输出'宏任务 1.1'
// 150ms后, 浏览器其他模块处理完异步任务2, 把宏任务2推到宏任务队列['宏任务 2'], 此时没有微任务，虽所以直接执行 '宏任务 2'，输出'宏任务 2'，把微任务 2.1推到微任务队列，依次loop微任务队列，输出'微任务 2.1'，结束event loop.