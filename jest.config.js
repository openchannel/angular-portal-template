const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['./jest.setup.js'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    collectCoverage: true,
    coveragePathIgnorePatterns: ['.mock.ts', 'node_modules', 'environments', 'assets'],
};
