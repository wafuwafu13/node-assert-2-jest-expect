var assert = require("assert");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    // -> expect(one).toBeTruthy();
    assert(one);
  });
});
