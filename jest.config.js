module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  coveragePathIgnorePatterns: ["/node_modules/", "/src/migrations/"],
  setupFiles: ["dotenv/config", "./src/initTests.ts"],
  testMatch: [
    "**/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "@swc/jest",
  },
};
