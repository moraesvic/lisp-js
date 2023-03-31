import { AST } from './lisp';

const _tokenToString = (token: AST): string => {
  if (Array.isArray(token)) {
    return `(${token.map((x) => _tokenToString(x)).join(' ')})`;
  } else {
    return token?.toString() || 'NIL';
  }
};

export const tokenToString = (token: AST) =>
  _tokenToString(token)
    .replace(/\s{2,}/g, ' ')
    .replace('( )', '()');

const _stringToToken = (splitted: string[]) => {
  const out = [] as AST[];
  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === '(') {
      let nest = 1;
      const inner = [] as string[];
      while (nest > 0) {
        i++;
        inner.push(splitted[i]);
        if (splitted[i] === '(') {
          nest++;
          continue;
        }
        if (splitted[i] === ')') {
          nest--;
          continue;
        }
      }
      inner.pop();
      out.push(_stringToToken(inner));
      continue;
    }
    const el = splitted[i];
    const parsed = el.match(/^[\d.]+$/) !== null ? parseFloat(el) : el;
    out.push(parsed);
  }
  return out;
};

export const stringToToken = (str: string) => {
  const s =
    str
      .replace(/\((\S)/g, '( $1')
      .replace(/(\S)\)/g, '$1 )')
      .replace(/\(\(/g, '( (')
      .replace(/\)\)/g, ') )') + ' ';

  const arr = [] as string[];
  let quoting = false;
  let acc = '';
  for (let ch of s) {
    if (ch === ' ' && !quoting) {
      if (acc !== '') {
        arr.push(acc);
        acc = '';
      }
      continue;
    }

    if (ch === '"') {
      quoting = !quoting;
    }

    acc += ch;
  }
  // console.log(arr);
  return _stringToToken(arr)[0];
};
