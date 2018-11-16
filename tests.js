/* global module */

function testSuite(describe, spy) {

    describe("the 'torotoro' library", function (it, done) {

        it("should provide a function as the library root", function (assert) {
            assert(typeof spy === "function");
        });

        describe("a 'spy' function", function (it) {

            it("should track that it has been called", function (assert) {
                var fn = spy();
                assert(fn.called === false);

                fn();
                assert(fn.called === true);
                assert(fn.calls.length === 1);

                fn();
                assert(fn.calls.length === 2);
            });

            it("should track its calls", function (assert) {
                var fn = spy();

                fn(1);
                fn(1, 2);
                fn(1, 2, 3);

                assert(fn.calls.length === 3);
            });

            it("should track the arguments for each call", function (assert) {
                var fn = spy();

                fn(1);
                fn(1, 2);
                fn(1, 2, 3);

                assert(fn.calls[0].args[0] === 1);
                assert(fn.calls[1].args[1] === 2);
                assert(fn.calls[2].args[2] === 3);
            });

            it("should track the results for each call without a provided implementation", function (assert) {
                var fn = spy();

                fn(1);
                fn(1, 2);
                fn(1, 2, 3);

                assert(typeof fn.calls[0].result === "undefined");
                assert(typeof fn.calls[1].result === "undefined");
                assert(typeof fn.calls[2].result === "undefined");
            });

            it("should take a mock implementation as the first argument", function (assert) {
                var fn = spy(function (x, y, z) {
                    return 42 + (x || 0) + (y || 0) + (z || 0);
                });

                fn();
                fn(1);
                fn(1, 2);
                fn(1, 2, 3);
                fn(1, 2, 3);

                assert(fn.calls[0].result === 42, "not 42");
                assert(fn.calls[1].result === 43, "not 43");
                assert(fn.calls[2].result === 45, "not 45");
                assert(fn.calls[3].result === 48, "not 48");
                assert(fn.calls[3].result === 48, "not 48");
            });

            it("should always create a new spy", function (assert) {
                var fn1 = spy();
                var fn2 = spy();

                assert(fn1 !== fn2);
            });

        });

        done();
    });

}

function configureDescribe(reporter) {
    var flush = reporter.flush;
    var push = reporter.push;
    var scope = reporter.scope;

    return function describe(suiteName, suite) {
        var state = {
            hasPassed: true,
            results: [],
            title: suiteName
        };

        function it(should, check) {
            var itState = {
                hasPassed: true,
                results: [],
                title: should
            };

            function assert(condition, msg) {
                var result = null;

                if (!condition) {
                    itState.hasPassed = false;
                    state.hasPassed = false;
                }

                result = condition
                    ? {
                        hasPassed: true,
                        title: "Ok"
                    }
                    : {
                        hasPassed: false,
                        title: msg || "<- Err"
                    };

                itState.results.push(result);
            }

            scope(function (done) {
                push(itState);

                try {
                    check(assert);
                } catch (e) {
                    itState.hasPassed = false;
                    itState.error = e.message;
                }

                if (!itState.hasPassed) {
                    scope(function (done2) {
                        var i = 0;
                        while (i < itState.results.length) {
                            push(itState.results[i]);
                            i += 1;
                        }
                        done2();
                    });
                }

                itState.results = itState.results.reverse();

                done();
            });
        }

        scope(function (done) {
            push(state);

            try {
                suite(it, flush);
            } catch (e) {
                state.hasPassed = false;
                state.error = e.message;
            }

            state.results = state.results.reverse();

            done();
        });

    };
}

if (typeof module === "object" && module.exports) {
    var chalk = require("chalk");

    testSuite(configureDescribe((function (state) {
        state.level = 0;
        state.results = [];

        function inc() {
            state.level += 1;
        }

        function dec() {
            state.level -= 1;
        }

        function flushResults(results) {
        }

        return {
            flush: function () {
                var i = 0;
                var result = null;
                var ok = true;

                while (i < state.results.length) {
                    result = state.results[i];

                    if (result.hasPassed) {
                        console.log("  ".repeat(result.level) + chalk.green(result.title));
                    } else {
                        ok = false;
                        console.log("  ".repeat(result.level) + chalk.red(result.title));
                        if (result.error) {
                            console.log("  ".repeat(result.level) + "> " + chalk.red(result.error));
                        }
                    }

                    i = i + 1;
                }

                if (ok) {
                    console.log(chalk.green("Test suite passed."));
                } else {
                    console.log(chalk.red("Test suite failed."));
                    process.exit(1);
                }
            },
            scope: function (fn) {
                inc();
                fn(dec);
            },
            push: function (result) {
                result.level = state.level;
                state.results.push(result);
            }
        };
    }({}))), require("./torotoro.js"));

} else {
    (typeof window === "undefined" ? this : window).configureDescribe = configureDescribe;
    (typeof window === "undefined" ? this : window).testSuite = testSuite;
}
