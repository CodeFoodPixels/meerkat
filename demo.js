let meerkat = load('index.js');

meerkat.test('test', function(t) {
    t.test('test', function (t) {
        t.pass('test passed');
    });
    t.start();
});

meerkat.start();
