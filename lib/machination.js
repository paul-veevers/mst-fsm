/*  eslint-disable no-use-before-define */
import { types, getSnapshot } from 'mobx-state-tree';
import jsf from 'json-schema-faker';
import revHash from 'rev-hash';
import seedrandom from 'seedrandom';
import ReactTestRenderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import stateChart from './state_chart';
import {
  find,
  includes,
  mapValues,
  values,
  keys,
  reduce,
  assign,
  asyncIterate,
  arrayRemoveRight,
  count
} from './utils';

configure({ adapter: new Adapter() });

function jsonSchemaForType(type) {
  if (!type.isType) throw new Error(`Is not an mst type: ${type}`);
  if (type.properties && type.properties.initial) {
    // is a sub machine
    return jsonSchemaForMachine(type);
  }
  switch (type.constructor) {
    case types.array(types.null).constructor:
      return [jsonSchemaForType(type.subType)];
    // case types.compose(types.model({}), types.model({})).constructor:
    //   throw new Error(`Unsupported type: ${type.describe()}`);
    // case types.enumeration(['a']).constructor:
    //   throw new Error('types.enumeration is a union type');
    case types.union(null, types.string, types.number).constructor:
      return jsonSchemaForType(type.types[0]);
    case types.frozen.constructor:
      throw new Error(`Unsupported type: ${type.describe()}`);
    case types.identifier(types.string).constructor:
      return jsonSchemaForType(type.identifierType);
    case types.late(() => {}).constructor:
      throw new Error(`Unsupported type: ${type.describe()}`);
    case types.literal().constructor:
      return { default: type.value };
    case types.map(types.string).constructor: {
      return { type: 'object' };
    }
    case types.maybe(types.string).constructor:
      return jsonSchemaForType(type.type);
    case types.model({}).constructor: {
      return {
        type: 'object',
        properties: mapValues(type.properties, jsonSchemaForType),
        required: keys(type.properties)
      };
    }
    case types.optional(types.null, null).constructor:
      return jsonSchemaForType(type.type);
    case types.reference(types.model({ a: types.identifier(types.string) }))
      .constructor:
      throw new Error(`Unsupported type: ${type.describe()}`);
    case types.refinement(types.string, () => {}).constructor:
      throw new Error(`Unsupported type: ${type.describe()}`);
    default:
  }
  switch (type.name) {
    case 'boolean':
      return { type: 'boolean' };
    case 'Date':
      return { default: 1516689808463 };
    case 'null':
      return { default: null };
    case 'number':
      return { type: 'number' };
    case 'undefined':
      return { default: undefined };
    case 'string':
      return { type: 'string' };
    default:
  }
  throw new Error(`Unsupported type: ${type.describe()}`);
}

// build an array that contains each reachable state at least once
// while still being a valid transition path
// undo is allowed in order to get out of dead ends
// should be deterministic, so re-runs produce same output (referential transparency)
function pathBuilder(states, next, stack = [], undo) {
  stack.push(next);
  const v = find(values(states[next]), a => !includes(stack, a));
  // dead end
  if (!v) {
    if (undo) return undo();
    // we've come back to the beginning and have no more paths to follow
    // remove duplicates from end of stack
    return arrayRemoveRight(stack, a => count(stack, a) > 1);
  }
  return pathBuilder(states, v, stack, () =>
    pathBuilder(states, next, stack, undo)
  );
}

function jsonSchemaForMachine(machine) {
  const initialSchema = jsonSchemaForType(machine.properties.initial);
  const statesSchema = jsonSchemaForType(machine.properties.states);
  const stateTypeSchemas = reduce(
    machine.properties.stack.type.subType.properties.data.types,
    (acc, v) =>
      assign({}, acc, {
        [v.name]: jsonSchemaForType(v)
      }),
    {}
  );
  return {
    initial: initialSchema,
    states: statesSchema,
    stack: pathBuilder(
      fakeJsonForSchema(machine, statesSchema),
      fakeJsonForSchema(machine, initialSchema)
    ).map(name => ({
      state: { default: name },
      data: stateTypeSchemas[name]
    }))
  };
}

function fakeJsonForSchema(machine, schema) {
  jsf.option({
    random: seedrandom(revHash(machine.describe())),
    useDefaultValue: true
  });
  return jsf(schema);
}

function fakeJsonForMachine(machine) {
  return fakeJsonForSchema(machine, jsonSchemaForMachine(machine));
}

function statesForMachine(machine) {
  return {
    initial: machine.properties.initial.type.value,
    states: mapValues(machine.properties.states.type.properties, v =>
      mapValues(v.properties, a => a.value)
    )
  };
}

export function reactTreesForMachine(machine, cmpnt) {
  return mapValues(fakeJsonForMachine(machine), d => {
    const data = machine.create(d).current.data;
    return ReactTestRenderer.create(
      cmpnt({ data, transition: () => {}, undo: () => {} })
    ).toJSON();
  });
}

export function stateChartForMachine(machine) {
  return stateChart(statesForMachine(machine));
}

export function monkeyForMachine(machine, cmpnt, parallel = 10, times = 100) {
  const simulator = () => {
    const machineInstance = machine.create();
    return () => {
      const elem = mount(
        cmpnt({
          data: machineInstance.current.data,
          transition: machineInstance.transition,
          undo: machineInstance.canUndo ? machineInstance.undo : null
        })
      );
      const clickables = elem.findWhere(
        node => typeof node.props().onClick === 'function'
      );
      if (!clickables.length)
        throw new Error('No clickable elements in component.');
      const rand = Math.floor(Math.random() * Math.floor(clickables.length));
      const clickMe = clickables.at(rand);
      const frozen = {
        state: machineInstance.current.state,
        store: getSnapshot(machineInstance.current.data),
        view: elem.debug(),
        clicked: clickMe.debug()
      };
      clickMe.simulate('click');
      return frozen;
    };
  };
  return asyncIterate(simulator, parallel, times);
}
