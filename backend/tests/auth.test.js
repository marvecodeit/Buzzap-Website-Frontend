process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// --- login validation ---
test('POST /api/auth/login rejects missing fields', async () => {
  const res = await request(app).post('/api/auth/login').send({});
  assert.strictEqual(res.status, 400);
  assert.ok(Array.isArray(res.body.details));
});

// --- signup is removed (admin-only system) ---
test('POST /api/auth/signup no longer exists (404)', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test', email: 'test@example.com', password: 'validpassword1' });
  assert.strictEqual(res.status, 404);
});

// --- protected route without token ---
test('GET /api/auth/me returns 401 without cookie', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.status, 'error');
});

// --- logout (no auth required) ---
test('POST /api/auth/logout returns 200', async () => {
  const res = await request(app).post('/api/auth/logout');
  assert.strictEqual(res.status, 200);
});

// --- forgot-password validation ---
test('POST /api/auth/forgot-password rejects invalid email', async () => {
  const res = await request(app)
    .post('/api/auth/forgot-password')
    .send({ email: 'bad' });
  assert.strictEqual(res.status, 400);
});

// --- reset-password validation ---
test('POST /api/auth/reset-password/:token rejects weak password', async () => {
  const res = await request(app)
    .post('/api/auth/reset-password/sometoken')
    .send({ password: 'weak' });
  assert.strictEqual(res.status, 400);
});

// --- health still works ---
test('GET /api/health still returns 200', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});
