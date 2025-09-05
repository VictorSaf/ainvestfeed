import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/server.ts'],
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: [],
  testTimeout: 20000
};

export default config;


