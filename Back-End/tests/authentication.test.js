const request = require('supertest');
const app = require('../app');

const PORT = process.env.PORT || 3001;

test('Sing up a new user', async () => {
  const response = await request(app)
    .post('/auth/sign-up')
    .send({
      nickName: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.test",
      password: "test",
      birthDate: "2020-01-01",
      role: "artist"
    });

  console.log(response.body);
  expect(response.statusCode).toBe(200);

  const responseObj = response.body;
  expect(responseObj).toHaveProperty('user');
  expect(responseObj).toHaveProperty('artist');
});
