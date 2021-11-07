// Debug AST: https://astexplorer.net/
// Babel Plugin Handbook: https://gist.github.com/wafuwafu13/d424f2eabb870ec4f338f10006eadff0
// Node.js Assert: https://nodejs.org/api/assert.html
// Jest Expect: https://jestjs.io/docs/expect
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
        /**
         * ```
         * const one = 1;
         * assert(one);
         * assert(1);
         * assert(undefined);
         * assert(one, "should be passed!");
         * ```
         * ->
         * ```
         * const one = 1;
         * expect(one).toBeTruthy();
         * expect(1).toBeTruthy();
         * expect(undefined).toBeTruthy();
         * expect(one).toBeTruthy();
         * ```
         */
        if (path.node.callee.name === "assert") {
          let arg;
          if (t.isIdentifier(path.node.arguments[0])) {
            arg = path.node.arguments[0].name;
          } else {
            arg = path.node.arguments[0].value;
          }
          const replaceCode = `expect(${arg}).toBeTruthy();`;
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
