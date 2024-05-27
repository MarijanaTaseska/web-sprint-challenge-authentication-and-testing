// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('../api/server')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('[POST] / register', () => {
  test('returns 201 on successful registration', async () => {
    const user = { username: 'bobi', password: 'bobi' }
    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('username', 'bobi')
  });
  test('returns 400 when username is taken', async () => {
    const user = { username: 'hobi', password: 'bibi' }
    await request(server).post('/api/auth/register').send(user); // register once
    const res = await request(server).post('/api/auth/register').send(user); // register again with the same username
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'username taken');
  });
})

describe('[POST] / login', () => {
  test('returns 200 on successful login', async () => {
    const user = { username: 'bobi', password: 'bobi' }
    const res = await request(server).post('/api/auth/login').send(user);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
  test('returns 401 if invalid credentials', async () => {
    const user = { username: 'bubamara', password: 'bobski' }
    const res = await request(server).post('/api/auth/login').send(user);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'invalid credentials')
  });
  test('returns 400 if username or pasword are missing', async () => {
    const user = { password: 'bobski' }
    const res = await request(server).post('/api/auth/login').send(user);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'username and password required')
  });
})
describe('[GET] / jokes', () => {
  let token
beforeEach(async () => {
  const response = await request(server)
    .post('/api/auth/login')
    .send({ username: 'bobi', password: 'bobi' })
     token = response.body.token;
})
  test('returns 401 if no token is provided', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message', 'token required')
  })
  test('returns 200 and jokes when valid token is provided', async () => {
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', `${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
  })
})
