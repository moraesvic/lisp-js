type Function = (...args: any[]) => Atom;
export type Env = { [key: string]: Atom | Function };
export type AST = Atom | AST[];

type Atom = string | number | boolean | null;
type RawString = `"${string}"` | `'${string}'`;

const isQuoted = (x: Atom): x is RawString =>
  typeof x === 'string' && x.match(/(["']).*\1/) !== null;

const unquote = (raw: RawString) => raw.slice(1, -1);

/**
 * Using Lisp-y terminology, car = first and cdr = rest
 */
const car = <T>(arr: T[]) => arr[0];
const cdr = <T>(arr: T[]) => arr.slice(1);

const resolveAST = (ast: AST, env: Env): Atom | Function => {
  // A single atom (i.e. "x", 5 or "hello") is also a valid expression
  if (!Array.isArray(ast)) {
    if (isQuoted(ast)) {
      return unquote(ast);
    }
    if (ast === null || typeof ast === 'number' || typeof ast === 'boolean') {
      return ast;
    }
    if (ast in env) {
      const resolved = env[ast];
      return resolved;
    }
    throw new Error(`Cannot resolve ${ast}`);
  }

  const first = car(ast);
  const rest = cdr(ast);

  if (first === 'define') {
    if (typeof rest[0] !== 'string') {
      throw new Error("Wrong syntax for 'define'");
    }
    env[rest[0]] = resolveAST(rest[1], env);
    return null;
  }

  const proc = resolveAST(first, env);
  if (typeof proc !== 'function') {
    throw new Error(
      `Expected a procedure that can be applied to arguments, given: ${first}`
    );
  }

  const args = rest.map((x) => resolveAST(x, env));

  const result = proc(...args);
  return result;
};

export const lispEval = (ast: AST, env: Env): Atom => {
  const resolved = resolveAST(ast, env);
  if (typeof resolved === 'function') {
    throw new Error("Final result can't be a function");
  }
  return resolved;
};
