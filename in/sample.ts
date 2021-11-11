var assert = require("assert");
let fake = require("fake");
import { equal } from "assert";

describe("node-assert-2-jest-expect", () => {
  it("typescript", () => {
    const one: number = 1;
    const two = 2 as any;

    assert(one);
    assert.equal(two, 2);
  });
});
