process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// Analytics endpoints require an authenticated admin/staff.
test('GET /api/analytics/overview returns 401 without auth', async () => {
  const res = await request(app).get('/api/analytics/overview');
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.status, 'error');
});

test('GET /api/analytics/leads-timeseries returns 401 without auth', async () => {
  const res = await request(app).get('/api/analytics/leads-timeseries');
  assert.strictEqual(res.status, 401);
});

test('GET /api/analytics/overview with invalid token returns 401', async () => {
  const res = await request(app)
    .get('/api/analytics/overview')
    .set('Cookie', 'buzzap_token=not-a-real-jwt');
  assert.strictEqual(res.status, 401);
});

test('GET /api/analytics/traffic returns 401 without auth', async () => {
  const res = await request(app).get('/api/analytics/traffic');
  assert.strictEqual(res.status, 401);
});

// The page-view beacon is PUBLIC (no auth) — validation still applies.
test('POST /api/analytics/pageview rejects an empty body with 400', async () => {
  const res = await request(app).post('/api/analytics/pageview').send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.status, 'error');
});

test('POST /api/analytics/pageview does not require auth (400 on bad body, not 401)', async () => {
  const res = await request(app).post('/api/analytics/pageview').send({ path: '' });
  assert.notStrictEqual(res.status, 401);
});
