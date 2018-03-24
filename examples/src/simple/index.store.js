import { types } from 'mobx-state-tree';
import { Machine } from '../../../dist/browser/index';
import states from './index.state';

const first = types.model('first', {
  string: types.literal('first'),
  number: types.literal(1)
});
first.guard = () => ({
  string: 'first',
  number: 1
});

const second = types.model('second', {
  string: types.literal('second'),
  number: types.literal(2)
});
second.guard = () => ({
  string: 'second',
  number: 2
});

const third = types.model('third', {
  string: types.literal('third'),
  number: types.literal(3)
});
third.guard = () => ({
  string: 'third',
  number: 3
});

export default Machine('Index', states, { first, second, third }, err => {
  throw err;
});
