import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
};

export default config;
