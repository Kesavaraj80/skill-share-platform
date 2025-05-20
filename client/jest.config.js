/** @type {import('jest').Config} */
const config = {
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = config 