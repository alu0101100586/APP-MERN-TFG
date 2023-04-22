module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/index.js',
    '!**/jest.config.js',
    '!**/config/*',
    '!**/controllers/*',
    '!**/middlewares/*',
    '!**/routes/index.js'
  ]
}
