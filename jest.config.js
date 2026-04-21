module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tools', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'tools/**/*.ts',
    'src/**/*.ts',
    '!tools/**/*.test.ts',
    '!tools/**/__tests__/**',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
  ],
};
