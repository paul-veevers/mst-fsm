import React from 'react';
import PropTypes from 'prop-types';
import { Observer, PropTypes as MobxPropTypes } from 'mobx-react';

const Machinist = ({ machine, children }) => (
  <Observer>
    {() =>
      children({
        data: machine.current.data,
        transition: machine.transition,
        undo: machine.canUndo ? machine.undo : null
      })
    }
  </Observer>
);

Machinist.propTypes = {
  machine: PropTypes.shape({
    states: PropTypes.shape({}).isRequired,
    stack: MobxPropTypes.arrayOrObservableArrayOf(
      PropTypes.shape({
        state: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired
      })
    ).isRequired,
    transition: PropTypes.func.isRequired,
    undo: PropTypes.func.isRequired,
    canUndo: PropTypes.bool.isRequired
  }).isRequired,
  children: PropTypes.func.isRequired
};

export default Machinist;
