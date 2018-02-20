print('TAP version 13 #');

let Meerkat = {
    _initialized: false,
    _queue: [],
    _pointer: 0,
    _assertionCount: 0,
    _depth: 0,
    _message: '',
    _planned: false,
    _runningTests: false,
    _shouldEnd: false,
    _pumpQueue: function() {
        if (this._pointer >= this._queue.length) {
            this._runningTests = false;

            if (this._shouldEnd) {
                this._end();
            }
            return;
        }

        print(this._getPadding() + '# Subtest: ' + this._queue[this._pointer].message)

        let tap = {
            _initialized: true,
            _depth: this._depth + 1,
            _queue: [],
            _pointer: 0,
            _assertionCount: 0,
            _planned: false,
            _runningTests: false,
            _shouldEnd: false,
            _parent: this,
            _message: this._queue[this._pointer].message,
            _testNumber: this._pointer + 1,
            _pumpQueue: this._pumpQueue,
            _printResult:this._printResult,
            _printEnd: this._printEnd,
            _getPadding: this._getPadding,
            plan: this.plan,
            queueTest: this.queueTest,
            runTests: this.runTests,
            _end: this._end,
            end: this.end,
            pass: function(message) {
                this._assertionCount = this._assertionCount + 1;
                this._printResult(true, this._assertionCount, message);
            },

            fail: function(message) {
                this._assertionCount = this._assertionCount + 1;
                this._printResult(false, this._assertionCount, message);
            },

            ok: function(actual, message) {
                if (actual) {
                    return this.pass(message);
                }

                return this.fail(message);
            },

            notOk: function(actual, message) {
                if (!actual) {
                    return this.pass(message);
                }

                return this.fail(message);
            },

            equal: function(actual, expected, message) {
                if (actual === expected) {
                    return this.pass(message);
                }

                return this.fail(message);
            },

            notEqual: function(actual, expected, message) {
                if (actual !== expected) {
                    return this.pass(message);
                }

                return this.fail(message);
            },

            _same: function(actual, expected) {
                if (typeof actual !== typeof expected) {
                    return false;
                }

                if (typeof actual === 'object') {
                    let actualLength = 0;
                    let expectedLength = 0;

                    for (let key in actual) {
                        if (
                            typeof expected[key] === 'undefined' ||
                            !this._same(actual[key], expected[key])
                        ) {
                            return false;
                        }

                        actualLength++;
                    }

                    for (let key in expected) {
                        expectedLength++;
                    }

                    if (actualLength !== expectedLength) {
                        return false;
                    }

                    return true;
                } else if (typeof actual === 'array') {
                    if (actual.length !== expected.length) {
                        return false;
                    }

                    let matched = [];

                    for (let a = 0; a < actual.length; a++) {
                        let match = false;
                        for (let e = 0; e < expected.length; e++) {
                            if (matched[e] !== true && this._same(actual[a], expected[e])) {
                                matched[e] = true;
                                match = true;
                                break;
                            }
                        }

                        if (!match) {
                            return false;
                        }
                    }

                    return true;
                } else {
                    return actual === expected;
                }
            },

            same: function(actual, expected, message) {
                if (this._same(actual, expected)) {
                    return this.pass(message);
                }

                return this.fail(message);
            },

            notSame: function(actual, expected, message) {
                if (!this._same(actual, expected)) {
                    return this.pass(message);
                }

                return this.fail(message);
            }
        };

        this._queue[this._pointer++].callback(tap);
    },

    _printResult: function(ok, count, message) {
        message = message || '(anonymous)';

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

    plan: function(number) {
        print('1..' + JSON.stringify(number) + ' #')
        this._planned = true;
    },

    queueTest: function(message, callback) {
        this._queue[this._queue.length] = {
            message: message,
            callback: callback
        }
    },
    runTests: function() {
        this._runningTests = true;
        this._pumpQueue();
    },

    _end: function() {
        if (!this._planned) {
            this._printEnd();
        }

        if (typeof this._parent !== 'undefined') {
            this._parent._printResult(true, this._parent._pointer, this._message);
            print();
            this._parent._pumpQueue();
        }
    },

    end: function() {
        if (this._runningTests) {
            this._shouldEnd = true;
        } else {
            this._end();
        }
    },

    load: function(filepath, mocks) {
        let lastSlash = -1;
        let path = '';
        let file = '';

        let realLoad = global.load;

        for (let i = 0; i < filepath.length; i++) {
            if (filepath[i] === '/') {
                lastSlash = i;
            }
        }

        if (lastSlash > -1) {
            path = filepath.slice(0, lastSlash) + '/';
            file = filepath.slice(lastSlash + 1, filepath.length);
        } else {
            file = filepath;
        }

        let mockglobal = {
            isNaN: isNaN,
            NaN: NaN,
            Object: Object,
            JSON: JSON,
            chr: chr,
            gc: gc,
            die: die,
            getMJS: getMJS,
            mkstr: mkstr,
            ffi_cb_free: ffi_cb_free,
            ffi: ffi,
            print: print,
            load: function(file, loadGlobal) {
                if (typeof loadGlobal !== 'undefined') {
                    realLoad(path + file, loadGlobal);
                } else {
                    realLoad(path + file);
                }
            }
        };

        mockglobal.global = mockglobal;

        load(path + file, mockglobal);

        return mockglobal;
    }
};
