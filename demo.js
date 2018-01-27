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

    t.runTests();
    t.end();
});

meerkat.runTests();
meerkat.end();
