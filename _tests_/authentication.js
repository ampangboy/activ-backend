test('suplied password ', () => {
  expect(true).toBe(true);

  // A function for sign up, should takes one arguement (password)
  // SHA2 for the password
  // return the encrypted password
  // use faker to create a dummy password
  // MySQL on localhost is http://host.docker.internal:3306

  const emailAddress = 'pally@gmail.com';
  const password = 'pallySECRET@123';

  const userId = saveUserInfo(emailAddress, password);
  expect(userId).toEqual(expect.any(Number));
});
