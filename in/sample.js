var assert = require("assert");
let fake = require("fake");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
    fake(one);

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
});
