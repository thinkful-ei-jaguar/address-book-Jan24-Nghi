// Require chai and supertest in setup.js
// Configured in package.json
// :oad logic for testing
const app = require('../src/app');

describe('App', () => {
  it('GET / responds 200 "Hello, Nghi!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, Nghi!');
  });
});