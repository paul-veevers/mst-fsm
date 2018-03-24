export const index = {
  initial: 'green',
  states: {
    green: {
      CHANGE: 'yellow'
    },
    yellow: {
      CHANGE: 'red'
    },
    red: {
      CHANGE: 'green',
      MAINTENANCE: 'maintenance'
    },
    maintenance: {
      CHANGE: 'red'
    }
  }
};

export const admin = {
  initial: 'john',
  states: {
    john: {
      CHANGE: 'paul'
    },
    paul: {
      CHANGE: 'john'
    }
  }
};
