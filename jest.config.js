module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@app$": "<rootDir>/src/app",
    "^@config$": "<rootDir>/src/config",
    "^@errors$": "<rootDir>/src/errors",
    "^@constants$": "<rootDir>/src/constants",
    "^@services$": "<rootDir>/src/services",
    "^@types$": "<rootDir>/src/types",
    "^@middlewares$": "<rootDir>/src/middlewares",
    "^@models$": "<rootDir>/src/models"
  }
};
