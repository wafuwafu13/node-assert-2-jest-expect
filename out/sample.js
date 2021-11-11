let fake = require("fake");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    fake(one);
    const fake = fake();
    const fakeComponent = fake(<Fake />);
    assert(<Fake />);
    assert(fake.fake(<fake />));
    expect(one).toBeTruthy();
    expect(1).toBeTruthy();
    expect(undefined).toBeTruthy();
    expect(sample()).toBeTruthy();
    expect(function () {
      return 1;
    }()).toBeTruthy();
    expect(one).toBeTruthy();
    expect(!one).toBeTruthy();
  });
  it("assert.equal", () => {
    assert.equal(<Fake />, 1);
    assert.equal(fake.fake(<fake />), 1);
    const one = 1;
    expect(one).toBe(1);
    expect(function () {
      return 1;
    }()).toBe(1);
    expect(one).toBe(1);
    expect(!one).toBe(2);
    expect(!one).toBe(2);
  });
  it("assert.deepEqual/strictEqual/deepStrictEqual", () => {
    assert.deepEqual(<Fake />, 1);
    assert.deepEqual(fake.fake(<fake />), 1);
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
    fake.deepEqual(one, 1);
    expect({
      foo: "bar2",
      hoge: "fuga2"
    }).toStrictEqual({
      hoge: "fuga2",
      foo: "bar2"
    });
    expect(one).toStrictEqual(1);
  });
  it("assert.notEqual", () => {
    const one = 1;
    expect(one).not.toBe(0);
  });
  it("assert.notStrictEqual", () => {
    const one = 1;
    expect(one).not.toStrictEqual("1a");
  });
  it("equal/deepEqual", () => {
    const one = 1;
    expect(one).toBe(1);
    expect(one).toStrictEqual(1);
  });
});