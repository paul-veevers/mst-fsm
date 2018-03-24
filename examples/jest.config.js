module.exports = {
  testMatch: ['**/src/**/*.spec.js'],
  moduleFileExtensions: ['js'],
  globalSetup: './test/setup.js',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/dist/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: './test/coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
