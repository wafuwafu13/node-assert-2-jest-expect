const fs = require("fs");
const path = require("path");
const { transform } = require("./index");

const inDir = path.join(__dirname, "in");

describe("transform in/ to jest expect", () => {
  it.each(fs.readdirSync(inDir))("%s", async (file) => {
    const { code } = await transform(path.join(inDir, file));
    expect(code).toMatchSnapshot();
  });
});
