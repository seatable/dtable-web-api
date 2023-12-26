const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  roots: ["<rootDir>/tests/"],
  testMatch: [ "<rootDir>/tests/**/(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
}