var assert = require("assert");
let fake = require("fake");
import { equal } from "assert";
import { deepEqual } from "power-assert";

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    fake(one);
    const fake = fake();
    const fakeComponent = fake(<Fake />);
    assert(<Fake />);
    assert(fake.fake(<fake />));

    assert(one);
    assert(1);
    assert(undefined);
    assert(sample());
    assert(
      (function () {
        return 1;
      })()
    );
    assert(one, "should be passed!");
  });

  it("assert.equal", () => {
    assert.equal(<Fake />, 1);
    assert.equal(fake.fake(<fake />), 1);
    const one = 1;
    assert.equal(one, 1);
    assert.equal(
      (function () {
        return 1;
      })(),
      1
    );
    assert.equal(one, 1, "should be passed!");
  });

  it("assert.deepEqual/strictEqual/deepStrictEqual", () => {
    assert.deepEqual(<Fake />, 1);
    assert.deepEqual(fake.fake(<fake />), 1);
    const one = 1;
    assert.deepEqual(one, 1);
    assert.deepEqual(
      { foo: "bar", hoge: "fuga" },
      { hoge: "fuga", foo: "bar" }
    );
    assert.strictEqual(one, 1);
    fake.deepEqual(one, 1);
    assert.deepStrictEqual(
      { foo: "bar2", hoge: "fuga2" },
      { hoge: "fuga2", foo: "bar2" }
    );
    assert.deepEqual(one, 1, "should be passed!");
  });

  it("assert.notEqual", () => {
    const one = 1;
    assert.notEqual(one, 0);
  });

  it("assert.notStrictEqual", () => {
    const one = 1;
    assert.notStrictEqual(one, "1a");
  });

  it("equal/deepEqual", () => {
    const one = 1;
    equal(one, 1);
    deepEqual(one, 1);
  });
});
