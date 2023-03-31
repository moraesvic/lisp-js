import { compute, Input } from "./compute";
import { lispEval, AST, Env } from "./lisp";
import { removeFunctionsFromObject } from "./utils";

/**
 * The calculation mechanism (defined below) is going to print the message in 'label',
 * bind the variables listed to the evaluation of their respective AST / S-expr's,
 * and output the evaluation of 'calc' taking into consideration the environment
 * variables defined both in 'table' and extended by 'bind'.
 */
const inputs: Input[] = [
  /* Resolves the variable directly from the environment */
  {
    label: "What is the value of π?",
    calc: "pi",
  },
  /* Function with one argument */
  {
    label: "Please count to 100.",
    calc: ["range", 100],
  },
  /* A bit more contrived, prints a custom message depending on the result of
   * an inequation */
  {
    label: "Are we earning more than spending?",
    calc: ["yes-or-no", [">=", ["*", "income_weekly", 4], "expenses_monthly"]],
  },
  /* Binding */
  {
    label: "What are our monthly net earnings?",
    bind: [
      ["income_monthly", ["*", "income_weekly", 4]],
      ["_", ["define", "income_monthly", 0]],
    ],
    calc: ["usd", ["-", "income_monthly", "expenses_monthly"]],
  },
  {
    label: "How much will we pay on taxes this month?",
    bind: [["income_monthly", ["*", "income_weekly", 4]]],
    calc: ["usd", ["*", "income_monthly", 0.1]],
  },
  /* Binding multiple values for easier computation */
  {
    label: "After taxes are paid, how much money will be left?",
    bind: [
      ["income_monthly", ["*", "income_weekly", 4]],
      ["taxes", ["*", "income_monthly", 0.1]],
      ["net", ["-", "income_monthly", "expenses_monthly"]],
    ],
    calc: ["usd", ["-", "net", "taxes"]],
  },
  {
    label: "How much is that in euros?",
    bind: [
      ["income_monthly", ["*", "income_weekly", 4]],
      ["taxes", ["*", "income_monthly", 0.1]],
      ["net", ["-", "income_monthly", "expenses_monthly"]],
    ],
    calc: ["euro", ["usd-to-eur", ["-", "net", "taxes"]]],
  },
  {
    label:
      "Assuming a book costs 20 dollars, how many books will I be able to buy when I have paid taxes?",
    bind: [
      ["income_monthly", ["*", "income_weekly", 4]],
      ["taxes", ["*", "income_monthly", 0.1]],
      ["net", ["-", "income_monthly", "expenses_monthly"]],
    ],
    calc: ["concat", ["/", ["-", "net", "taxes"], 20], "' books'"],
  },
];

const extendedEnv = {
  income_weekly: 500,
  expenses_monthly: 1200,
  pi: Math.PI,
  "yes-or-no": (pred: boolean) => (pred ? "Yes, we are." : "No, we aren't."),
  usd: (x: number) => `$ ${x.toFixed(2)}`,
  euro: (x: number) => `€ ${x.toFixed(2)}`,
  "usd-to-eur": (usd: number) => usd * 0.93,
};

const tableWithoutFunctions = removeFunctionsFromObject(extendedEnv);
console.log("Starting with env variables (functions omitted for brevity):\n");
console.table(tableWithoutFunctions);
inputs.forEach((input) => compute(input, extendedEnv));
