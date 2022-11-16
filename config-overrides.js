/* eslint-disable */
const { rewirePaths } = require('./webpack-overrides');

const pipe = (...modifiers) => (config) => modifiers.reduce((rewiredConfig, modifier) => modifier(rewiredConfig), config);

const override = pipe(rewirePaths);

module.exports = override;
