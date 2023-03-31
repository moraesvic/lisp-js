import { AST, Env, lispEval } from "./lisp";

export type Input = {
  label: string;
  bind?: [string, AST][];
  calc: AST;
};

export const compute = (input: Input, extendedEnv: Env = {}) => {
  const env: Env = input.bind
    ? input.bind.reduce(
        (prev, [key, val]) => ({
          ...prev,
          [key]: lispEval(val, prev),
        }),
        { ...extendedEnv }
      )
    : { ...extendedEnv };

  const result = lispEval(input.calc, env);
  console.log(input.label);
  console.log("  -> " + result + "\n");
};
