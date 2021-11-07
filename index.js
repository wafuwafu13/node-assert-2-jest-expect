// Debug AST: https://astexplorer.net/
// Babel Plugin Handbook: https://gist.github.com/wafuwafu13/d424f2eabb870ec4f338f10006eadff0
// Node.js Assert: https://nodejs.org/api/assert.html
// Jest Expect: https://jestjs.io/docs/expect
const { transformFileSync } = require("@babel/core");
const generate = require("@babel/generator").default;
const { writeFile } = require("fs");

const plugin = ({ types: t, template }) => {
  return {
    visitor: {
      VariableDeclaration: (path) => {
        const args = path.node.declarations[0].init.arguments;
        if (args && args[0].value === "assert") {
          /**
           * Remove
           * ```
           * var assert = require("assert");
           * ```
           */
          path.remove();
        }
      },
      CallExpression: (path) => {
        if (
          /**
           * ```
           * const one = 1;
           * assert(one);
           * assert(1);
           * assert(undefined);
           * assert(sample());
           * assert(
           *   (function () {
           *     return 1;
           *   })()
           * );
           * assert(one, "should be passed!");
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).toBeTruthy();
           * expect(1).toBeTruthy();
           * expect(undefined).toBeTruthy();
           * expect(sample()).toBeTruthy();
           * expect(function () {
           *   return 1;
           * }()).toBeTruthy();
           * expect(one).toBeTruthy();
           * ```
           */
          path.node.callee.name === "assert"
        ) {
          const arg = generate(path.node.arguments[0]).code;
          const replaceCode = `expect(${arg}).toBeTruthy();`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        } else if (
          /**
           * ```
           * const one = 1;
           * assert.equal(one, 1);
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).toBe(1);
           * ```
           */
          t.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === "assert" &&
          path.node.callee.property.name === "equal"
        ) {
          const actualArg = generate(path.node.arguments[0]).code;
          const expectedArg = generate(path.node.arguments[1]).code;
          const replaceCode = `expect(${actualArg}).toBe(${expectedArg});`;
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
