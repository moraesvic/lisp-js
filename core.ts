export const core = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
  "=": (a: number, b: number) => a === b,
  ">": (a: number, b: number) => a > b,
  "<": (a: number, b: number) => a < b,
  ">=": (a: number, b: number) => a >= b,
  "<=": (a: number, b: number) => a <= b,
  eq: (a: string, b: string) => a === b,
  concat: (...args: string[]) => args.join(""),
  range: (x: number) => {
    const _range = (start: number, stop: number, acc: number[]): number[] =>
      start >= stop ? acc : _range(start + 1, stop, [...acc, start]);
    return _range(1, x + 1, []).join(", ");
  },
};
