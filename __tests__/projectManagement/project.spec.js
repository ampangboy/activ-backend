const request = require('supertest');
const app = require('../../app');

test('POST /project it save the project successfully', async () => {
  const res = await request(app).post('/project').set({ authorization: 'Bearer ' }).send({
    emailAddress: 'zfaba.a@gmail.com',
    password: 'Core@123',
  });

  expect(res.statusCode).toBe(401);
});
