import { core } from './core';
import { AST, Atom, Env, lisp } from './lisp';
import { str2Token, token2Str } from './parenthesis';

export type Input = {
  query: string;
  calc: AST[];
};

const compute_1 = (
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

const compute_2 = (calc: AST[], extendedEnv: Env = {}, verbose = false) => {
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

export function compute(
  input: Input,
  extendedEnv?: Env,
  verbose?: boolean
): Atom;

export function compute(
  calc: AST[],
  extendedEnv?: Env,
  verbose?: boolean
): Atom;

export function compute(
  first: Input | AST[],
  extendedEnv: Env = {},
  verbose: boolean = false
) {
  const isInput = (x: Input | AST[]): x is Input =>
    typeof (first as any).query !== 'undefined';

  if (isInput(first)) {
    return compute_1(first, extendedEnv, verbose);
  }

  return compute_2(first, extendedEnv, verbose);
}
