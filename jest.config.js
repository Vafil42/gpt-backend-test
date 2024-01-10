module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  modulePaths: ["<rootDir>"],
  testRegex: "test.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
