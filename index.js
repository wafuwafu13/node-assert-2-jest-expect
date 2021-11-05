// Can debug AST at https://astexplorer.net/
const { transformFileSync } = require("@babel/core");

const plugin = () => {
  return {
    pre() {
      console.log("pre");
    },
    visitor: {
      BinaryExpression: (path) => {
        if (path.node.left.name == "n") {
          path.node.left.name = "x";
        }
      },
    },
  };
};

const { code } = transformFileSync("sample.js", { plugins: [plugin] });
console.log(code);
