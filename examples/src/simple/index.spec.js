import fs from 'fs';
import {
  reactTreesForMachine,
  stateChartForMachine,
  monkeyForMachine
} from '../../../dist/node/index.node';
import IndexStore from './index.store';
import { IndexView } from './index.view';

test('reactTreesForMachine', () => {
  expect(reactTreesForMachine(IndexStore, IndexView)).toMatchSnapshot();
});

test('stateChartForMachine', async () => {
  const chart = await stateChartForMachine(IndexStore, IndexView);
  fs.writeFileSync('./test/statechart.example.simple.png', chart.png, 'base64');
  fs.writeFileSync('./test/statechart.example.simple.pdf', chart.pdf, 'base64');
  expect(chart.json).toMatchSnapshot();
});

test('monkeyForMachine', () => {
  monkeyForMachine(IndexStore, IndexView);
  expect(true).toBe(true);
});
