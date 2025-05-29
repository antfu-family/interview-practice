import antfu from '@antfu/eslint-config'

export default antfu({}, {
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
  },
  files: ['**/*.test.ts', '**/*.spec.ts'],
})
