import { core } from "./core";

export type Env = { [key: string]: Atom | ((...args: any[]) => Atom) };
export type AST = Atom | AST[];

type Atom = string | number | boolean | null;
type RawString = `"${string}"` | `'${string}'`;

const define = Symbol.for("define");

const isQuoted = (x: Atom): x is RawString =>
  typeof x === "string" && x.match(/(["']).*\1/) !== null;

const unquote = (raw: RawString) => raw.slice(1, -1);

/**
 * Using Lisp-y terminology, car = first and cdr = rest
 */
const car = <T>(arr: T[]) => arr[0];
const cdr = <T>(arr: T[]) => arr.slice(1);

const resolveSymbol = (sym: Atom, env: Env) => {
  // Can this be resolved as a raw string?
  if (isQuoted(sym)) {
    return unquote(sym);
  }

  // Is this a number, boolean or null?
  if (sym === null || typeof sym === "number" || typeof sym === "boolean") {
    return sym;
  }

  if (sym === "define") {
    return define;
  }

  const resolved = env[sym];
  if (resolved === undefined) {
    throw new Error(`Symbol ${sym} is not defined`);
  }
  return resolved;
};

const resolveAST = (ast: AST, env: Env) => {
  // A single atom (i.e. "x", 5 or "hello") is also a valid expression
  if (!Array.isArray(ast)) {
    const resolved = resolveSymbol(ast, env);
    if (typeof resolved === "symbol") {
      throw new Error(`Bad syntax for special form ${Symbol.keyFor(resolved)}`);
    }
    return resolved;
  }

  // TODO fix
  const first = resolveSymbol(car(ast) as any, env);
  const rest = cdr(ast)
    .map((x) => (Array.isArray(x) ? resolveAST(x, env) : x))
    .map((x) => {
      if (typeof x === "function") {
        throw new Error("Function not allowed in this position");
      }
      if (x === null) {
        throw new Error("'null' not allowed in this position");
      }
      return x;
    })
    .map((x) => resolveSymbol(x, env));

  if (typeof first === "symbol") {
    const key = Symbol.keyFor(first);
    switch (key) {
      case "define": {
        if (
          rest.length !== 2 ||
          typeof rest[0] !== "string" ||
          (typeof rest[1] !== "string" &&
            typeof rest[1] !== "number" &&
            typeof rest[1] !== "boolean")
        ) {
          console.log({ rest });
          throw new Error("Wrong syntax for 'define'");
        }
        env[rest[0]] = rest[1];
        return null;
      }
      default:
        throw new Error("Invalid symbol");
    }
  }

  if (typeof first !== "function") {
    throw new Error(
      `Expected a procedure that can be applied to arguments, given: ${first}`
    );
  }

  const result = first(...rest);
  return result;
};

export const lispEval = (ast: AST, env: Env) =>
  resolveAST(ast, { ...core, ...env });
