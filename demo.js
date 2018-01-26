let meerkat = load('index.js');

meerkat.queueTest('test', function (t) {
    t.pass('test passed');
    t.end();
});

meerkat.queueTest('test2', function (t) {
    t.pass('test2 passed');
    t.end();
});

meerkat.runTests();
meerkat.end();
