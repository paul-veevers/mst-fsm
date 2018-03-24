export default {
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
