import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Simple from './simple/index.view';
import TrafficLight from './traffic_light/index.view';

const Example = ({ title, children }) => (
  <div style={{ margin: '50px' }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    <div style={{ padding: '50px', border: '1px solid #ccc' }}>{children}</div>
  </div>
);

Example.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

ReactDOM.render(
  <div>
    <Example title="Simple">
      <Simple />
    </Example>
    <Example title="Traffic Light">
      <TrafficLight />
    </Example>
  </div>,
  document.getElementById('app')
);
