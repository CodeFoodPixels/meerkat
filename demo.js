let meerkat = load('index.js');

meerkat.queueTest('wrapper', function(t) {
    t.queueTest('test', function (t) {
        t.pass('test passed');
        t.end();
    });

    t.queueTest('test2', function (t) {
        t.fail('test2 failed');
        t.end();
    });

    t.queueTest('array same', function (t) {
        let array1 = [
            'test1',
            'test2',
            'test3',
            'test4',
            'test5',
        ];

        let array2 = [
            'test4',
            'test1',
            'test3',
            'test2',
            'test5',
        ];

        t.same(array1, array2, 'array same');
        t.end();
    });

    t.queueTest('object same', function (t) {
        let testFunc = function() {
            return true;
        };

        let object1 = {
            func: testFunc,
            arr: [
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
            ],
            obj: {
                test: true
            },
            str: 'test'
        };

        let object2 = {
            str: 'test',
            func: testFunc,
            obj: {
                test: true
            },
            arr: [
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
            ]
        };

        t.same(object1, object2, 'obj same');
        t.end();
    });

    t.runTests();
    t.end();
});

meerkat.runTests();
meerkat.end();
