import { types, getSnapshot } from 'mobx-state-tree';
import { last, keys, values, mapValues } from './utils';

export default function Machine(name, state, stateTypes, onError) {
  return types
    .model(`${name}mstfsmmachine`, {
      initial: types.optional(types.literal(state.initial), state.initial),
      states: types.optional(
        types.model(
          'MachineStates',
          mapValues(state.states, (v, k) =>
            types.model(k, mapValues(v, a => types.literal(a)))
          )
        ),
        state.states
      ),
      stack: types.optional(
        types.array(
          types.model('StackModel', {
            state: types.enumeration(keys(state.states)),
            data: types.union(null, ...values(stateTypes))
          })
        ),
        []
      )
    })
    .views(self => ({
      get current() {
        return last(self.stack);
      },
      canTransition(event) {
        return !!self.states[self.current.state][event];
      },
      get canUndo() {
        return self.stack.length > 1;
      }
    }))
    .actions(self => ({
      afterCreate() {
        self.pushStack(state.initial);
      },
      pushStack(next) {
        const snap = getSnapshot(self.stack);
        try {
          if (!self.states[next]) throw new Error(`no such state ${next}`);
          if (!stateTypes[next])
            throw new Error(`no corresponding type for the event ${next}`);
          if (typeof stateTypes[next].guard !== 'function')
            throw new Error(`type has no guard static method: ${next}`);
          const data = stateTypes[next].guard();
          if (!data)
            throw new Error(`${next}.guard should not return a false-y value.`);
          self.stack.push({
            state: next,
            data
          });
        } catch (err) {
          // rollback any changes, atomic
          self.stack = snap;
          onError(err, snap);
        }
      },
      transition(event) {
        if (!self.canTransition(event)) {
          onError(
            new Error(`cannot transition ${self.current} -> ${event}`),
            getSnapshot(self.stack)
          );
          return;
        }
        self.pushStack(self.states[self.current.state][event]);
      },
      undo() {
        if (!self.canUndo) {
          onError(new Error('Cannot undo'), getSnapshot(self.stack));
          return;
        }
        self.stack.pop();
      }
    }));
}
