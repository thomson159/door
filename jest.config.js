module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json"],
  transform: {
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@react-hook/media-query)/)"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|inline\\.svg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/public/"],
};
