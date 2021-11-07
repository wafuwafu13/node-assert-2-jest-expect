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
  });
});