const { checkJwtValidity } = require('../../utils/jwt');

test('verify the token is valid', async () => {
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNiwiaWF0IjoxNjMyODk4MzY3LCJleHAiOjE2NDA2NzQzNjd9.70Qw9ucM8yqUDL7IMY8vVknPfgB2NMBn5oThgtUBMGg';

  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNiwiaWF0IjoxNjMyODk4MzY3LCJleH2d4jE2NDA2NzQzNjd9.70Qw9ucM8yqUDL7IMl9hVknPfgB2NMBn5oThgtUBMGg';

  expect(await checkJwtValidity(validToken)).toBe(true);
  expect(await checkJwtValidity(invalidToken)).toBe(false);
});
