# torotoro
A minimalistic dependency free spy library that runs everywhere


## Usage
* `npm install torotoro`

```javascript

const spy = require("torotoro");

describe(`torotoro`, () => {
    it(`should provide a plain spy factory function`, () => {
        const fn = spy();
        expect(fn.called).to.equal(0);
        expect(fn.calls.length).to.equal(0);

        fn(42);
        expect(fn.called).to.be.true;
        expect(fn.calls.length).to.equal(1);
        expect(fn.calls[0].args[0]).to.equal(42);
    });
    it(`should track arguments and results`, () => {
        const fn = spy(x => x * x);

        fn(2);
        fn(3);

        expect(fn.called).to.be.true;
        expect(fn.calls[0].args[0]).to.equal(2);
        expect(fn.calls[0].result).to.equal(4);
        expect(fn.calls[1].args[0]).to.equal(3);
        expect(fn.calls[1].result).to.equal(9);
    });
});

```

## Why should I use it?
* It is focused
* It has no dependencies
* It runs in every reasonable JavaScript engine you can conjure up


## What's the browser support?
There should be no problems running this library in IE6, so go figure.


# FAQ

Q: Why, just... why?
A: I wanted a really minimalistic library for faking functions and this was fun to do.

Q: Why is there no minified build?
A: The library is pretty minimal, there's really no need.

Q: What's with the name?
A: "torotoro" means "to spy on" in the Maori language.
