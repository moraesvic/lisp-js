import { compute, Input } from './compute';
import { removeFunctionsFromObject } from './utils';

/**
 * The calculation mechanism (defined below) is going to print the message in 'label',
 * bind the variables listed to the evaluation of their respective AST / S-expr's,
 * and output the evaluation of 'calc' taking into consideration the environment
 * variables defined both in 'table' and extended by 'bind'.
 */
const inputs: Input[] = [
  /* Resolves the variable directly from the environment */
  {
    query: 'Greetings!',
    calc: ['(print "Hello world!")'],
  },
  {
    query: 'What is the value of π?',
    calc: ['PI'],
  },
  {
    query: 'What is E rounded to 3 decimal places?',
    calc: ['(to-fixed E 3)'],
  },
  {
    query: 'What is the square root of 2?',
    calc: ['(sqrt 2)'],
  },
  /* Function with one argument */
  {
    query: 'Please count to 100.',
    calc: ['(range 100)'],
  },
  /* A bit more contrived, prints a custom message depending on the result of
   * an inequation */
  {
    query: 'Are we earning more than spending?',
    calc: ['(yes-or-no (>= (* income-weekly 4) expenses-monthly))'],
  },
  {
    query: 'What are our monthly net earnings?',
    calc: [
      '(define income-monthly (* income-weekly 4))',
      '(usd (- income-monthly expenses-monthly))',
    ],
  },
  {
    query: 'How much will we pay on taxes this month?',
    calc: [
      '(define income-monthly (* income-weekly 4))',
      '(usd (* income-monthly 0.1))',
    ],
  },
  /* Binding multiple values for easier computation */
  {
    query: 'After taxes are paid, how much money will be left?',
    calc: [
      '(define income-monthly (* income-weekly 4))',
      '(define taxes (* income-monthly 0.1))',
      '(define net (- income-monthly expenses-monthly))',
      '(usd (- net taxes))',
    ],
  },
  {
    query: 'How much is that in euros?',
    calc: [
      '(define income-monthly (* income-weekly 4))',
      '(define taxes (* income-monthly 0.1))',
      '(define net (- income-monthly expenses-monthly))',
      '(concat "€ " (to-fixed (usd-to-eur (- net taxes)) 2))',
    ],
  },
  {
    query:
      'Assuming a book costs 27 dollars, how many books will I be able to buy when I have paid taxes?',
    calc: [
      '(define income-monthly (* income-weekly 4))',
      '(define taxes (* income-monthly 0.1))',
      '(define net (- income-monthly expenses-monthly))',
      '(concat (floor (/ (- net taxes) 27)) " books")',
    ],
  },
  {
    query: 'Print the profit and tell me if we have a problem.',
    calc: [
      '(define sales 1200)',
      '(define royalties 400)',
      '(define expenses 1000)',
      '(define taxes (* sales 0.15))',
      '(define thresh 750)',
      '(define profit (- (+ sales royalties) (+ expenses taxes)))',
      '(print (concat "KPI is: " (usd profit)))',
      '(print (concat "Alert should trigger? " (<= profit thresh)))',
    ],
  },
];

const extendedEnv = {
  'income-weekly': 500,
  'expenses-monthly': 1200,
  'yes-or-no': (pred: boolean) => (pred ? 'Yes, we are.' : "No, we aren't."),
  usd: (x: number) => `$ ${x.toFixed(2)}`,
  'usd-to-eur': (usd: number) => usd * 0.93,
  range: (x: number) => {
    const _range = (start: number, stop: number, acc: number[]): number[] =>
      start >= stop ? acc : _range(start + 1, stop, [...acc, start]);
    return _range(1, x + 1, []).join(', ');
  },
};

console.table(removeFunctionsFromObject(extendedEnv));
inputs.forEach((input) => compute(input, extendedEnv, true));
