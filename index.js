let Meerkat = {
    _initialized: false,
    _queue: [],
    _pointer: 0,
    _assertionCount: 0,
    _depth: 0,
    _message: '',
    _pumpQueue: function() {
        if (this._pointer >= this._queue.length) {
            return;
        }

        print(this._getPadding() + '# Subtest: ' + this._queue[this._pointer].message)

        let tap = {
            _initialized: true,
            _depth: this._depth + 1,
            _queue: [],
            _pointer: 0,
            _assertionCount: 0,
            _parent: this,
            _message: this._queue[this._pointer].message,
            _testNumber: this._pointer + 1,
            _pumpQueue: this._pumpQueue,
            _printResult:this._printResult,
            _printEnd: this._printEnd,
            _getPadding: this._getPadding,
            queueTest: this.queueTest,
            runTests: this.runTests,
            end: this.end,
            pass: function (message) {
                this._assertionCount = this._assertionCount + 1;
                this._printResult(true, this._assertionCount, message);
            },

            fail: function (message) {
                this._assertionCount = this._assertionCount + 1;
                this._printResult(false, this._assertionCount, message);
            },
        };

        this._queue[this._pointer++].callback(tap);
    },

    _printResult: function (ok, count, message) {
        let printMessage = this._getPadding();
        printMessage += ok ? 'ok' : 'not ok';
        printMessage += ' ' + JSON.stringify(count);
        printMessage += ' - ' + message + ' #';

        print(printMessage);
    },

    _printEnd: function() {
        let printMessage = this._getPadding() + '1..' + JSON.stringify(this._queue.length + this._assertionCount) + ' #';

        print(printMessage);
    },

    _getPadding: function() {
        let padding = '';

        if (typeof this._depth !== 'undefined') {
            for (let i = 0; i < this._depth; i++) {
                padding += '    ';
            }
        }

        return padding;
    },

    queueTest: function (message, callback) {
        this._queue[this._queue.length] = {
            message: message,
            callback: callback
        }
    },
    runTests: function() {
        if (!this._initialized) {
            print('TAP version 13 #');
        }

        this._pumpQueue();
    },

    end: function () {
        this._printEnd();
        if (typeof this._parent !== 'undefined') {
            this._parent._printResult(true, this._parent._pointer, this._message);
            print();
            this._parent._pumpQueue();
        }
    }
}
