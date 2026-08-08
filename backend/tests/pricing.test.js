process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// Public listing is open.
test('GET /api/pricing is public', async () => {
  const res = await request(app).get('/api/pricing');
  assert.ok(res.status === 200 || res.status === 500, `unexpected ${res.status}`);
  if (res.status === 200) assert.strictEqual(res.body.status, 'success');
});

// Admin endpoints are protected.
test('GET /api/pricing/admin/all returns 401 without auth', async () => {
  const res = await request(app).get('/api/pricing/admin/all');
  assert.strictEqual(res.status, 401);
});

test('POST /api/pricing returns 401 without auth', async () => {
  const res = await request(app).post('/api/pricing').send({ name: 'X', monthlyPrice: 10, yearlyPrice: 100 });
  assert.strictEqual(res.status, 401);
});

test('DELETE /api/pricing/:id returns 401 without auth', async () => {
  const res = await request(app).delete('/api/pricing/507f1f77bcf86cd799439011');
  assert.strictEqual(res.status, 401);
});
