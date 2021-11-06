// Can debug AST at https://astexplorer.net/
const { transformFileSync } = require("@babel/core");
const { writeFile } = require("fs");

const plugin = () => {
  return {
    visitor: {
      VariableDeclaration: (path) => {
        const args = path.node.declarations[0].init.arguments;
        if (args && args[0].value === "assert") {
          // Remove `var assert = require("assert");`
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

const { code } = transformFileSync("in/sample.js", { plugins: [plugin] });

writeFile("out/sample.js", code, (err) => {
  if (err) throw err;
  console.log("saved!");
});
