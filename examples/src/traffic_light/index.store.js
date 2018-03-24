import { types } from 'mobx-state-tree';
import { Machine } from '../../../dist/browser/index';
import { index, admin } from './index.state';

const green = types.model('green', {
  label: types.literal('green'),
  canMaintain: types.literal(false)
});
green.guard = () => ({
  label: 'green',
  canMaintain: false
});

const yellow = types.model('yellow', {
  label: types.literal('yellow'),
  canMaintain: types.literal(false)
});
yellow.guard = () => ({
  label: 'yellow',
  canMaintain: false
});

const red = types.model('red', {
  label: types.literal('red'),
  canMaintain: types.literal(true)
});
red.guard = () => ({
  label: 'red',
  canMaintain: true
});

const john = types.model('john', {
  name: types.literal('john')
});
john.guard = () => ({
  name: 'john'
});

const paul = types.model('paul', {
  name: types.literal('paul')
});
paul.guard = () => ({
  name: 'paul'
});

const maintenance = types.model('maintenance', {
  label: types.literal('maintenance'),
  canMaintain: types.literal(false),
  admin: Machine('Admin', admin, { john, paul }, err => {
    throw err;
  })
});
maintenance.guard = () => ({
  label: 'maintenance',
  canMaintain: false,
  admin: {}
});

export default Machine(
  'Index',
  index,
  { green, yellow, red, maintenance },
  err => {
    throw err;
  }
);
