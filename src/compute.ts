import { core } from './core';
import { AST, Env, lispEval } from './lisp';
import { stringToToken, tokenToString } from './parenthesis';

const VERBOSE = true;

export type Input = {
  query: string;
  calc: AST[];
};

export const compute = ({ query, calc }: Input, extendedEnv: Env = {}) => {
  console.log(query);

  const env = { ...extendedEnv, ...core };
  const result = calc
    .map((x) => (typeof x === 'string' ? stringToToken(x) : x))
    .reduce((prev, curr) => lispEval(curr, env), null);

  if (VERBOSE) {
    console.log();
    calc.forEach((exp) => console.log(tokenToString(exp)));
    console.log();
  }

  console.log('  -> ' + result + '\n');
};
