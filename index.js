let Meerkat = {
    initialized: false,
    queue: [],
    test: function (message, callback) {
        this.queue[this.queue.length] = {
            message: message,
            callback: callback
        }
    },
    start: function() {
        let tap = {
            initialized: true,
            depth: typeof this.depth === 'undefined' ? 0 : this.depth + 1,

            queue: [],

            test: this.test,

            start: this.start,

            pass: function (message) {
                this.printResult(true, message);
            },

            fail: function (message) {
                this.printResult(false, message);
            },

            printResult: function (ok, message) {
                let printMessage = '';

                for (let i = 0; i < this.depth; i++) {
                    printMessage += '    ';
                }

                printMessage += ok ? 'ok' : 'not ok';
                printMessage += ' ' + JSON.stringify(this.testNumber);
                printMessage += ' ' + this.message + ' - ' + message;

                print(printMessage);
            }
        };

        if (!this.initialized) {
            print('TAP version 13');
        }

        for (let i = 0; i < this.queue.length; i++) {
            let tapInstance = Object.create(tap);

            tapInstance.message = this.queue[i].message

            tapInstance.testNumber = i + 1;

            this.queue[i].callback(tapInstance);
        }

        let printMessage = '';

        if (typeof this.depth !== 'undefined') {
            for (let i = 0; i < this.depth + 1; i++) {
                printMessage += '    ';
            }
        }

        printMessage += '1..' + JSON.stringify(this.queue.length);

        print(printMessage);
    }
}
