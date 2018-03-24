## Note this is experimental

# MST-FSM

Finite State Machine for Mobx State Tree and React.

### Why?
Finite State Machines (FSM's) are popular in many types of UI development - but not Javascript/browsers. This is an exploration to see where and when FSM's might be useful in browser UI development.

FSM theoretically could be useful in browsers because they:
- have declarative states, e.g. jquery vs. react
- ensure "correctness", e.g. it is not possible for a traffic light to transition from green to red, it must go through orange
- See all the reading below for more information.

This is relevant in modern browser UIs because:
- apps are increasingly complex:
	- lots of business logic is implemented client-side
	- apps have many different states (loading, error, success, toggles, pagination, etc)
	- testing (unit, integration, etc) is not great. Each component has it's own logic and states, and are often async. How can you possibly test all the permutations? Current best practice seems to be a UI integration test: generate fake data, render the whole tree for each permutation, snapshot it, then eyeball any difference to spot errors/regressions. Pretty sub-optimal.
- some recent-ish ecosystem developments potentially make FSM's much more useful:
	- declarative UI (React) where UI is a function of state (view = f(state))
	- type systems (Typescript, Flow, Mobx State Tree)

The idea is to combine the following:
- declarative state using types
- declarative transitions between states
- declarative UI

If you combine those you statically have all the information you need to:
- render all possible permutations of the UI
- ensure the UI cannot put the FSM into an invalid state.

That sounds pretty useful for automated testing.

### Implementation
The best way to see what I'm talking about is to see the example folders - e.g. /examples/traffic_light. Start in the index.view.js file then the store then the state files. Once you think you've groked what is happening, have a look at the spec/test file.

And if you're brave have a look inside the lib folder.

### Conclusions
Using a FSM with MST types and React we're able to achieve:
- one-line auto-generation of a state chart diagram that can embed the corresponding rendered UI for each state.
- one-line test that snapshots all possible permutations of a React tree given a machine, with deterministic fake value generation so that snapshots are consistent on subsequent runs.
- one-line test that monkey tests your react tree. It starts from initial state, randomly clicks a click-able element to transition to next state, re-renders react tree, and repeats n times. It ensures your UI and machine can never be in an invalid state. It would also be possible to simulate other UI events like input typing, etc.

However:
- Current implementation is not purely static. In practice, you would need to mock some things like API, etc. It should be possible to parse the code (e.g. using babel/babylon) to get all the required informaton, and then only React render function needs to be called with props to generate tree.
- There is likely a much more flexible implementation somehow using above point (static analysis), with a proper type system like Typescript, Flow, (Graphql?).
- With that in mind a future implementation would need to:
	- statically extract all possible states and their transitions (a state chart)
	- statically extract the shape of each state (types)
	- pure render React tree given props
	- pass a 'transition' function in props, which requires a runtime of some kind

### Reading
- <https://rauchg.com/2015/pure-ui>
- <https://medium.com/@asolove/pure-ui-control-ac8d1be97a8d>
- <https://github.com/choojs/website/blob/f66155a078db15c5877945eed8646e0902ce1a47/content/guides/state-machines.md>
- <https://statecharts.github.io/>
- <https://github.com/davidkpiano/xstate>
- <https://github.com/MicheleBertoli/react-automata>
- <https://www.amazon.com/Constructing-User-Interface-Statecharts-Horrocks/dp/0201342782>
- <https://spectrum.chat/thread/18e47ad2-3162-4696-952b-afb039056246>
- <https://github.com/aksonov/statem>
- <https://github.com/jbeard4/SCION>
- <http://machina-js.org/>
- <http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf>
- <http://krasimirtsonev.com/blog/article/managing-state-in-javascript-with-state-machines-stent>
- <https://github.com/krasimir/stent>
- <https://www.youtube.com/watch?v=VU1NKX6Qkxc&feature=youtu.be>
- <https://www.youtube.com/watch?v=MkdV2-U16tc>
- see bottom of <https://www.npmjs.com/package/jssm>
- <https://github.com/fschaefer/Stately.js>

### TODO
- jsonSchemaForMachine needs to return proper schema for machine model (initial, states, stack, etc)
- reactTreesForMachine needs to pass in a real machine instance that has had applySnapshot done with fake json schema data, otherwise computeds, sub machines, etc won't work
- write lib test with sub machine
- call machine.transition from stores
- event payloads
- api naming/structure should follow xstate, scxml (see bottom of https://statecharts.github.io/how-to-use-statecharts.html)
- https://github.com/mapbox/pixelmatch/blob/master/README.md
- make all machinations support sub machines
  - e.g. reactTreesForMachine needs to render for all possible subtree combinations
- history (undo/redo, pause/replay)
  - https://stackoverflow.com/questions/701131/data-structure-used-to-implement-undo-and-redo-option
- structural sharing of states
  - a.data.label is not the same observable as b.data.label, which forgoes many of the benefits of mobx
    - whole component tree will be re-rendered on state change rather than just deep observer components
    - could automatically create generic union type from provided types that dynamically references the correct prop of current state. Views would then use this guy to render, etc. see https://github.com/mobxjs/mobx-state-tree#customizable-references