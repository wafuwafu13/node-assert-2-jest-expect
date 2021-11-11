let fake = require("fake");

describe("node-assert-2-jest-expect", () => {
  it("typescript", () => {
    const one = 1;
    const two = 2;
    expect(one).toBeTruthy();
    expect(two).toBe(2);
  });
});
export {};