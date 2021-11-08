const assert = require("assert");

describe("node-assert-to-jest-expect", () => {
  it("assert-2-expect", () => {
    const one = 1;
    assert(one);
    expect(one).toBeTruthy();
    assert(1);
    expect(1).toBeTruthy();
    assert(
      (function () {
        return 1;
      })()
    );
    assert(one, "should be passed!");
  });

  it("assert.equal-2-expect", () => {
    const one = 1;
    assert.equal(one, 1);
    expect(one).toBe(1);
    assert.equal(
      (function () {
        return 1;
      })(),
      1
    );
    expect(
      (function () {
        return 1;
      })()
    ).toBe(1);
    assert.equal(one, 1, "should be passed!");
  });

  it("assert.deepEqual/strictEqual/deepStrictEqual-2-expect", () => {
    const one = 1;
    assert.deepEqual(one, 1);
    expect(one).toStrictEqual(1);
    assert.deepEqual(
      { foo: "bar", hoge: "fuga" },
      { hoge: "fuga", foo: "bar" }
    );
    expect({ foo: "bar", hoge: "fuga" }).toStrictEqual({
      hoge: "fuga",
      foo: "bar",
    });
    assert.strictEqual(one, 1);
    expect(one).toStrictEqual(1);
    assert.deepStrictEqual(
      { foo: "bar2", hoge: "fuga2" },
      { hoge: "fuga2", foo: "bar2" }
    );
    expect({ foo: "bar2", hoge: "fuga2" }).toStrictEqual({
      hoge: "fuga2",
      foo: "bar2",
    });
    assert.deepEqual(one, 1, "should be passed!");
  });

  it("assert.notEqual-2-expect", () => {
    const one = 1;
    assert.notEqual(one, 0);
    expect(one).not.toBe(0);
  });

  it("assert.notStrictEqual-2-expect", () => {
    const one = 1;
    assert.notStrictEqual(one, "1");
    expect(one).not.toStrictEqual("1");
  });
});
