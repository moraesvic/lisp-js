export const core = {
  PI: Math.PI,
  E: Math.E,
  abs: Math.abs,
  sin: Math.sin,
  sinh: Math.sinh,
  asin: Math.asin,
  asinh: Math.asinh,
  cos: Math.cos,
  cosh: Math.cosh,
  acos: Math.acos,
  acosh: Math.acosh,
  tan: Math.tan,
  tanh: Math.tanh,
  atan: Math.atan,
  atanh: Math.atanh,
  round: Math.round,
  trunc: Math.trunc,
  max: Math.max,
  min: Math.min,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  pow: Math.pow,
  random: Math.random,
  ceil: Math.ceil,
  floor: Math.floor,
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  '=': (a: number, b: number) => a === b,
  '>': (a: number, b: number) => a > b,
  '<': (a: number, b: number) => a < b,
  '>=': (a: number, b: number) => a >= b,
  '<=': (a: number, b: number) => a <= b,
  eq: (a: string, b: string) => a === b,
  concat: (...args: string[]) => args.join(''),
  'to-fixed': (n: number, decimalPlaces: number) => n.toFixed(decimalPlaces),
  print: (message: string) => {
    console.log(message);
    return null;
  },
  match: (s: string, regex: string, flags = '') =>
    s.match(new RegExp(regex, flags)) !== null,
};
