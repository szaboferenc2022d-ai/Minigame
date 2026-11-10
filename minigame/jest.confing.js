export default { 
    testEnvironment: "node", 
    transform: { "^.+\\.[jt]sx?$": "babel-jest" }, 
    testMatch: ["**/src/**/*.test.js"], 
}; 
