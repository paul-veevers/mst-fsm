module.exports = {
  testMatch: ['**/lib/**/*.spec.js'],
  moduleFileExtensions: ['js'],
  globalSetup: './test/setup.js',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/lib/**/*.js',
    '!**/node_modules/**',
    '!**/lib/**/state_chart.js'
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
