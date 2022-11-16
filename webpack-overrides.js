/* eslint-disable */
const path = require('path');
const { alias, configPaths } = require('react-app-rewire-alias');

const rewirePaths = (config) => {
    const customPathsFileName = path.resolve(__dirname, 'tsconfig.paths.json');
    const rewire = alias(configPaths(customPathsFileName));
    return rewire(config);
};

module.exports = {
    rewirePaths,
};