// Debug AST: https://astexplorer.net/
// Babel Plugin Handbook: https://gist.github.com/wafuwafu13/d424f2eabb870ec4f338f10006eadff0
// Node.js Assert: https://nodejs.org/api/assert.html
// Jest Expect: https://jestjs.io/docs/expect
const { transformFileAsync } = require("@babel/core");
const generate = require("@babel/generator").default;
const fs = require("fs");

const plugin = ({ types: t, template }) => {
  const hasJSXElementArgument = (args) => {
    return (
      t.isJSXElement(args) ||
      (t.isCallExpression(args) && t.isJSXElement(args.arguments[0]))
    );
  };

  return {
    visitor: {
      VariableDeclaration: (path) => {
        const init = path.node.declarations[0].init;
        if (
          /**
           * Remove
           * ```
           * var assert = require("assert");
           * ```
           */
          init &&
          init.arguments &&
          init.arguments[0] &&
          init.arguments[0].value === "assert"
        ) {
          path.remove();
        }
      },
      ImportDeclaration: (path) => {
        if (
          /**
           * Remove
           * ```
           * import assert from 'assert';
           * import assert from 'power-assert';
           * ```
           */
          path.node.source.value === "assert" ||
          path.node.source.value === "power-assert"
        ) {
          path.remove();
        }
      },
      CallExpression: (path) => {
        if (
          /**
           * Replace
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
          if (
            /**
             * Skip
             * ```
             * assert(<Fake />)
             * assert(fake.fake(<fake />));
             * ```
             */
            hasJSXElementArgument(path.node.arguments[0])
          )
            return;
          const arg = generate(path.node.arguments[0]).code;
          const replaceCode = `expect(${arg}).toBeTruthy();`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        } else if (
          /**
           * Replace
           * ```
           * const one = 1;
           * assert.equal(one, 1);
           * assert(
           *  (function () {
           *    return 1;
           *  })(),
           *  1
           *);
           * assert.equal(one, 1, "should be passed!");
           * equal(one, 1);
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).toBe(1);
           * expect(function () {
           *   return 1;
           * }()).toBe(1);
           * expect(one).toBe(1);
           * expect(one).toBe(1);
           * ```
           */
          (t.isMemberExpression(path.node.callee) &&
            path.node.callee.object.name === "assert" &&
            path.node.callee.property.name === "equal") ||
          path.node.callee.name === "equal"
        ) {
          if (
            /**
             * Skip
             * ```
             * assert.equal(<Fake />, 1)
             * assert.equal(fake.fake(<fake />), 1);
             * ```
             */
            hasJSXElementArgument(path.node.arguments[0])
          )
            return;
          const actualArg = generate(path.node.arguments[0]).code;
          const expectedArg = generate(path.node.arguments[1]).code;
          const replaceCode = `expect(${actualArg}).toBe(${expectedArg});`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        } else if (
          /**
           * Replace
           * ```
           * const one = 1;
           * assert.deepEqual(one, 1);
           * assert.deepEqual(
           *   { foo: "bar", hoge: "fuga" },
           *   { hoge: "fuga", foo: "bar" }
           * );
           * assert.strictEqual(one, 1);
           * assert.deepStrictEqual(
           *   { foo: "bar2", hoge: "fuga2" },
           *   { hoge: "fuga2", foo: "bar2" }
           * );
           * assert.deepEqual(one, 1, "should be passed!");
           * deepEqual(one, 1);
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).toStrictEqual(1);
           * expect({ foo: "bar", hoge: "fuga" }).toStrictEqual({
           *   hoge: "fuga",
           *   foo: "bar",
           * });
           * expect(one).toStrictEqual(1);
           * expect({ foo: "bar2", hoge: "fuga2" }).toStrictEqual({
           *   hoge: "fuga2",
           *   foo: "bar2",
           * });
           * expect(one).toStrictEqual(1);
           * expect(one).toStrictEqual(1);
           * ```
           */
          (t.isMemberExpression(path.node.callee) &&
            path.node.callee.object.name === "assert" &&
            (path.node.callee.property.name === "deepEqual" ||
              path.node.callee.property.name === "strictEqual" ||
              path.node.callee.property.name === "deepStrictEqual")) ||
          path.node.callee.name === "deepEqual"
        ) {
          if (hasJSXElementArgument(path.node.arguments[0])) return;
          const actualArg = generate(path.node.arguments[0]).code;
          const expectedArg = generate(path.node.arguments[1]).code;
          const replaceCode = `expect(${actualArg}).toStrictEqual(${expectedArg});`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        } else if (
          /**
           * Replace
           * ```
           * const one = 1;
           * assert.notEqual(one, 0);
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).not.toBe(0);
           * ```
           */
          t.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === "assert" &&
          path.node.callee.property.name === "notEqual"
        ) {
          if (hasJSXElementArgument(path.node.arguments[0])) return;
          const actualArg = generate(path.node.arguments[0]).code;
          const expectedArg = generate(path.node.arguments[1]).code;
          const replaceCode = `expect(${actualArg}).not.toBe(${expectedArg});`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        } else if (
          /**
           * Replace
           * ```
           * const one = 1;
           * assert.notStrictEqual(one, "1");
           * ```
           * ->
           * ```
           * const one = 1;
           * expect(one).not.toStrictEqual("1");
           * ```
           */
          t.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === "assert" &&
          path.node.callee.property.name === "notStrictEqual"
        ) {
          if (hasJSXElementArgument(path.node.arguments[0])) return;
          const actualArg = generate(path.node.arguments[0]).code;
          const expectedArg = generate(path.node.arguments[1]).code;
          const replaceCode = `expect(${actualArg}).not.toStrictEqual(${expectedArg});`;
          const newAST = template(replaceCode)();
          path.replaceWith(newAST);
        }
      },
      JSXElement: (path) => {
        path.skip();
      },
    },
  };
};

const nodeToJest = async () => {
  try {
    const files = await fs.promises.readdir("./in");
    for (const file of files) {
      console.log(`S=============${file}============S`);
      const { code } = await transformFileAsync(`in/${file}`, {
        plugins: [plugin],
        presets: ["@babel/preset-react", "@babel/preset-typescript"],
      });
      await fs.promises.writeFile(`./out/${file}`, code);
      console.log(`E=============${file}============E`);
    }
  } catch (e) {
    console.log(e);
  }
};

nodeToJest();
