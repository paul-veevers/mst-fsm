import React from 'react';
import PropTypes from 'prop-types';
import { Machinist } from '../../../dist/browser/index';
import IndexStore from './index.store';

const Admin = ({ data, transition, undo }) => (
  <div>
    Current admin: {data.name}
    <button onClick={() => transition('CHANGE')}>Switch</button>
    {undo && <button onClick={undo}>Previous maintenance</button>}
  </div>
);

Admin.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  transition: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired
};

export const IndexView = ({ data, transition, undo }) => (
  <div>
    <h1>{data.label}</h1>
    <button onClick={() => transition('CHANGE')}>Next</button>
    {undo && <button onClick={undo}>Previous</button>}
    {data.canMaintain && (
      <button onClick={() => transition('MAINTENANCE')}>Maintenance</button>
    )}
    {data.admin && <Machinist machine={data.admin}>{Admin}</Machinist>}
  </div>
);

IndexView.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    canMaintain: PropTypes.bool.isRequired,
    admin: PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  }).isRequired,
  transition: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired
};

export default () => (
  <Machinist machine={IndexStore.create()}>{IndexView}</Machinist>
);
