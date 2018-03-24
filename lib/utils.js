export function last(arr) {
  return arr[arr.length - 1];
}

export function find(arr, fn) {
  return arr.find(fn);
}

export function includes(arr, val) {
  return arr.includes(val);
}

export function keys(obj) {
  return Object.keys(obj);
}

export function values(obj) {
  return Object.values(obj);
}

export function assign(...objs) {
  return Object.assign(...objs);
}

export function reduce(arr, fn, acc) {
  return arr.reduce(fn, acc);
}

export function map(arr, fn) {
  return arr.map(fn);
}

export function mapValues(obj, fn) {
  return reduce(
    keys(obj),
    (acc, k) => assign({}, acc, { [k]: fn(obj[k], k) }),
    {}
  );
}

export function flatten(arr) {
  return arr.reduce((a, b) => a.concat(b), []);
}

function pImmediate() {
  return new Promise(resolve => {
    setImmediate(() => {
      resolve();
    });
  });
}

function pImmediateIterator(func, times) {
  let counter = 0;
  const results = [];
  const iterate = resolve => {
    counter += 1;
    if (counter > times) return resolve(results);
    return pImmediate().then(() => {
      results.push(func());
      return iterate(resolve);
    });
  };
  return new Promise(iterate);
}

export function asyncIterate(func, parallel, times) {
  return Promise.all(
    Array(parallel)
      .fill(0)
      .map(() => pImmediateIterator(func(), times))
  );
}

export function arrayRemoveRight(arr, fn) {
  const a = arr.slice();
  const rev = arr.slice().reverse();
  let i = 0;
  while (i < arr.length && fn(rev[i])) {
    a.splice(a.lastIndexOf(rev[i]), 1);
    i += 1;
  }
  return a;
}

export function count(arr, val) {
  return arr.filter(a => a === val).length;
}
