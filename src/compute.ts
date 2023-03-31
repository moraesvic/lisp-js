import { core } from './core';
import { AST, Atom, Env, lisp } from './lisp';
import { str2Token, token2Str } from './parenthesis';

export type Input = {
  query: string;
  calc: AST[];
};

export const compute = (
  { query, calc }: Input,
  extendedEnv: Env = {},
  verbose = false
) => {
  if (verbose) {
    console.log(query);
  }

  const env = { ...extendedEnv, ...core };
  const result = calc
    .map((x) => (typeof x === 'string' ? str2Token(x) : x))
    .reduce((prev, curr) => lisp(curr, env), null);

  if (verbose) {
    console.log();
    calc.forEach((exp) => console.log(token2Str(exp)));
    console.log();
    console.log('  -> ' + result + '\n');
  }

  return result as Atom;
};
