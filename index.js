(function () {
    let tap = {
        count: 0,
        depth: 0,

        test: function(message, callback) {
            // callback(tap);
            // ^^^ Need to figure out how to work around scope issues
        },

        pass: function(message) {
            this.printResult(true, message);
        },

        fail: function (message) {
            this.printResult(false, message);
        },

        printResult: function(ok, message) {
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

    print('TAP version 13');

    return tap.test;
})()
