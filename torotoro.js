/* global define, module */
(function (global, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define("torotoro", [], factory);
    } else {
        global.torotoro = factory();
    }
}(typeof window === "undefined" ? this : window, function factory() {
    var slice = [].slice;

    function spy(fn) {
        fn = fn || function () {};

        function spy() {
            var args = slice.call(arguments);
            spy.called = true;
            spy.calls.push({
                args: args,
                result: fn.apply(null, args)
            });
        }
        spy.called = false;
        spy.calls = [];

        return spy;
    }
    spy.version = "0.1.0";
    spy.toString = function () {
        return "You are using torotoro@0.1.0";
    };

    return spy;
}));
