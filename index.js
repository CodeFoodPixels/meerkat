let Meerkat = {
    initialized: false,
    count: 0,
    test: function (message, callback) {
        let tap = {
            initialized: true,
            depth: typeof this.depth === 'undefined' ? 0 : this.depth + 1,

            count: 0,

            test: this.test,

            pass: function (message) {
                this.printResult(true, message);
            },

            fail: function (message) {
                this.printResult(false, message);
            },

            printResult: function (ok, message) {
                this.count = this.count + 1;

                let printMessage = '';

                for (let i = 0; i < this.depth; i++) {
                    printMessage += '    ';
                }

                printMessage += ok ? 'ok' : 'not ok';
                printMessage += ' ' + JSON.stringify(this.count);
                printMessage += ' ' + message;

                print(printMessage);
            }
        };

        if (!this.initialized) {
            print('TAP version 13');
        }
        this.count = this.count + 1;
        callback(tap);
    }
}
