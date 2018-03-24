import fs from 'fs';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from 'mobx-state-tree';
import {
  Machine,
  reactTreesForMachine,
  stateChartForMachine,
  monkeyForMachine
} from './index.node';

const states = {
  initial: 'first',
  states: {
    first: {
      NEXT: 'second'
    },
    second: {
      NEXT: 'third'
    },
    third: {
      NEXT: 'first'
    }
  }
};

const first = types.model('first', {
  array: types.array(types.string),
  boolean: types.boolean,
  date: types.Date,
  enumeration: types.enumeration(['enumeration1', 'enumeration2']),
  identifier: types.identifier(types.string),
  literal: types.literal('literal'),
  map: types.map(types.string),
  maybe: types.maybe(types.string),
  model: types.model({ foo: types.string }),
  null: types.null,
  optional: types.optional(types.string, 'optional string'),
  undefined: types.undefined,
  union: types.union(null, types.string, types.number),
  // number: types.number,
  // string: types.string,
  number: types.literal(1),
  string: types.literal('first')
});

first.guard = () => ({
  number: 1,
  string: 'first'
});

const second = types.model('second', {
  number: types.literal(2),
  string: types.literal('second')
});

second.guard = () => ({
  number: 2,
  string: 'second'
});

const third = types.model('third', {
  number: types.literal(3),
  string: types.literal('third')
});

third.guard = () => ({
  number: 3,
  string: 'third'
});

const cmpnt = ({ data, transition, undo }) => (
  <div>
    {data.string} : {data.number}
    <button onClick={() => transition('NEXT')}>btn</button>
    <button onClick={undo}>btn other</button>
  </div>
);

cmpnt.propTypes = {
  data: PropTypes.shape({
    string: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
  }).isRequired,
  transition: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired
};

const MachineType = Machine('Foo', states, { first, second, third }, err => {
  throw err;
});

test('reactTreesForMachine', () => {
  expect(reactTreesForMachine(MachineType, cmpnt)).toMatchSnapshot();
});

test(
  'stateChartForMachine',
  async () => {
    const chart = await stateChartForMachine(MachineType, cmpnt);
    fs.writeFileSync('./test/statechart.lib.png', chart.png, 'base64');
    fs.writeFileSync('./test/statechart.lib.pdf', chart.pdf, 'base64');
    expect(chart.json).toMatchSnapshot();
  },
  10000
);

test('monkeyForMachine', async () => {
  const results = await monkeyForMachine(MachineType, cmpnt);
  expect(results.length).toBe(10);
});
