let fake = require("fake");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    fake(one);
    expect(one).toBeTruthy();
    expect(1).toBeTruthy();
    expect(undefined).toBeTruthy();
    expect(sample()).toBeTruthy();
    expect(function () {
      return 1;
    }()).toBeTruthy();
    expect(one).toBeTruthy();
  });
  it("assert.equal", () => {
    const one = 1;
    expect(one).toBe(1);
    expect(function () {
      return 1;
    }()).toBe(1);
    expect(one).toBe(1);
  });
  it("assert.deepEqual", () => {
    const one = 1;
    expect(one).toStrictEqual(1);
    expect({
      foo: "bar",
      hoge: "fuga"
    }).toStrictEqual({
      hoge: "fuga",
      foo: "bar"
    });
    expect(one).toStrictEqual(1);
  });
  it("assert.notEqual", () => {
    const one = 1;
    expect(one).not.toBe(0);
  });
});