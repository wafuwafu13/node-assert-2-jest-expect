// Can debug AST at https://astexplorer.net/
const { transformFileSync } = require("@babel/core");

const plugin = () => {
  return {
    visitor: {
      CallExpression: (path) => {
        if (path.node.callee.name == "assert") {
          console.log("find `assert`");
        }
      },
    },
  };
};

const { code } = transformFileSync("sample.js", { plugins: [plugin] });
console.log("==================================");
console.log(code);
