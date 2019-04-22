module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@app$": "<rootDir>/src/app",
    "^@v1/errors$": "<rootDir>/src/v1/errors",
    "^@v1/constants$": "<rootDir>/src/v1/constants",
    "^@v1/services$": "<rootDir>/src/v1/services",
    "^@v1/types$": "<rootDir>/src/v1/types",
    "^@v1/middlewares$": "<rootDir>/src/v1/middlewares",
    "^@v1/models$": "<rootDir>/src/v1/models"
  }
};
