var assert = require("assert");
let fake = require("fake");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    fake(one);
    // -> expect(one).toBeTruthy();
    assert(one);
    assert(1);
    assert(undefined);
  });
});
