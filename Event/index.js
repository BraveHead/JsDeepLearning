(() => {
    class CustomEvent {
        constructor() {
            this.events = {};
        }
        

        addEventLicenser(type, callback) {
            if(typeof type !== 'string') {
                throw Error('type is not string');
            }
            if(typeof callback !== 'function') {
                throw Error('callback is not string');
            }
            if(!this.events[type]) {
                this.events[type] = [callback]
            } else {
                this.events[type].push(callback);
            }
        }

        dispatchEvent(type) {
            const licensers = this.events[type].slice();
            for(let licenser of licensers) {
               licenser()
            }
        }

        removeLicenser(type, licenser) {
            const index =  this.events[type].findIndex(v => v === licenser);
            if(index !== -1) {
                this.events[type].splice(index, 1);
            }
        }
    }

    const send = document.getElementById('send');
    const event = new CustomEvent();
     event.addEventLicenser('send', () => {
        const getMessageContainer = document.getElementById('get');
        if(getMessageContainer) {
            getMessageContainer.textContent = 'new message'
        }
     })
    send?.addEventListener('click', () => {
        event.dispatchEvent('send');
    });

})();