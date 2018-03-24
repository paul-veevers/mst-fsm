import React from 'react';
import PropTypes from 'prop-types';
import { Machinist } from '../../../dist/browser/index';
import IndexStore from './index.store';

export const IndexView = ({ data, transition }) => (
  <div>
    String: {data.string}
    <br />
    Number: {data.number}
    <br />
    <button onClick={() => transition('NEXT')}>Next</button>
  </div>
);

IndexView.propTypes = {
  data: PropTypes.shape({
    string: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
  }).isRequired,
  transition: PropTypes.func.isRequired
};

export default () => (
  <Machinist machine={IndexStore.create()}>{IndexView}</Machinist>
);
