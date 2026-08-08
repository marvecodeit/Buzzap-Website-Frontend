process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// --- public create validation ---
test('POST /api/leads rejects missing name/email', async () => {
  const res = await request(app).post('/api/leads').send({ message: 'hi' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.status, 'error');
  assert.ok(Array.isArray(res.body.details));
});

test('POST /api/leads rejects invalid email', async () => {
  const res = await request(app)
    .post('/api/leads')
    .send({ name: 'Jane Doe', email: 'nope' });
  assert.strictEqual(res.status, 400);
});

test('POST /api/leads rejects invalid source enum', async () => {
  const res = await request(app)
    .post('/api/leads')
    .send({ name: 'Jane Doe', email: 'jane@example.com', source: 'facebook' });
  assert.strictEqual(res.status, 400);
});

// --- admin endpoints are protected ---
test('GET /api/leads returns 401 without auth', async () => {
  const res = await request(app).get('/api/leads');
  assert.strictEqual(res.status, 401);
});

test('PATCH /api/leads/:id returns 401 without auth', async () => {
  const res = await request(app).patch('/api/leads/123').send({ status: 'won' });
  assert.strictEqual(res.status, 401);
});

test('DELETE /api/leads/:id returns 401 without auth', async () => {
  const res = await request(app).delete('/api/leads/123');
  assert.strictEqual(res.status, 401);
});
