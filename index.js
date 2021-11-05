// Can debug AST at https://astexplorer.net/
const { transformFileSync } = require("@babel/core");

const plugin = () => {
  return {
    visitor: {
      VariableDeclaration: (path) => {
        const arguments = path.node.declarations[0].init.arguments;
        if (arguments && arguments[0].value === "assert") {
          path.remove();
        }  
      },
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
