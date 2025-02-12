import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/src/**/*.{test,spec}.ts?(x)'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1', // Map `~` to `src/`
  },
};

export default config;