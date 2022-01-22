# node-assert-2-jest-expect

# [Before](./in) ▶️ [After](./out)

### Before

```js
var assert = require("assert");

describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;

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
    assert(!one);
  });
  ...
```

### After

```js
describe("node-assert-2-jest-expect", () => {
  it("assert", () => {
    const one = 1;
   
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
  ...
```
