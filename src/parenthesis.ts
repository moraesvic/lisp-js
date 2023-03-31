import { AST } from './lisp';

const _token2Str = (token: AST): string => {
  if (Array.isArray(token)) {
    return `(${token.map((x) => _token2Str(x)).join(' ')})`;
  } else {
    return token?.toString() || 'NIL';
  }
};

export const token2Str = (token: AST) =>
  _token2Str(token)
    .replace(/\s{2,}/g, ' ')
    .replace('( )', '()');

const _str2Token = (splitted: string[]) => {
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
      out.push(_str2Token(inner));
      continue;
    }
    const asFloat = parseFloat(splitted[i]);
    out.push(isNaN(asFloat) ? splitted[i] : asFloat);
  }
  return out;
};

export const str2Token = (str: string) => {
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
  return _str2Token(arr)[0];
};
