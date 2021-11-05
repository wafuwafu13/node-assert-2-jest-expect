// Can debug AST at https://astexplorer.net/
const { transform } = require("@babel/core");

const sourceCode = `function sample(n) {
  return n * n;
}`;

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

const { code } = transform(sourceCode, { plugins: [plugin] });

console.log(code);
