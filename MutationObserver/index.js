(() => {
    const observer = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            if(mutation.type === 'childList') {
                console.log('子节点被删除或者添加');
            } else if(mutation.type === 'attributes') {
                 console.log(`元素${mutation.target.nodeName}属性${mutation.attributeName}被改变`);
            }
        }
    })

    const changeMessage = document.getElementById('changeMessage');
    const showMessage = document.getElementById('showMessage')

    if(showMessage) {
        changeMessage?.addEventListener('click', () => {
            showMessage.textContent = 'I get it';
            showMessage.setAttribute('my', 'e12')
        })
        observer.observe(showMessage, {
            attributes: true,
            childList: true,
            characterData: true
        })
    }


    class MyMutationObserver {
        constructor(callback) {
            this.callback = callback
            this.targets = new Map();
        }

        observer(target, config) {
            const wrapper = {
                target,
                config,
                originalAppendChild: target.appendChild,
                originalRemoveChild: target.removeChild
            }
            target.appendChild = function(element) {
                this._onChildListChange(wrapper, 'add', element)
                return wrapper.originalAppendChild.call(target, element)
            }
            target.removeChild = function(element) {
                this._onChildListChange(wrapper, 'remove', element)
                return wrapper.originalRemoveChild.call(target, element)
            }
        }

        _onChildListChange(wrapper, changeType, node) {
            const mutationRecord = {
                type: 'childList',
                target: wrapper.target,
                addedNodes: changeType === 'add' ? [node] : [],
                removedNodes: changeType === 'remove' ? [node] : []
            }
            this.callback([mutationRecord]);
        }


        disconnect() {
            this.targets.forEach((wrapper) => {
                wrapper.target.appendChild = wrapper.originalAppendChild;
                wrapper.target.removeChild = wrapper.originalRemoveChild;
            })
            this.targets.clear();
        }
    }

})();