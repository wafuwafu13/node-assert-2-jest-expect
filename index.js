// Debug AST: https://astexplorer.net/
// Babel Plugin Handbook: https://gist.github.com/wafuwafu13/d424f2eabb870ec4f338f10006eadff0
const { transformFileSync } = require("@babel/core");
const { writeFile } = require("fs");

const plugin = ({ types: t, template }) => {
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
        // Replace `assert(one);` -> `expect(one).toBeTruthy();`
        if (path.node.callee.name === "assert") {
          const replaceCode = `expect(${path.node.arguments[0].name}).toBeTruthy();`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
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
