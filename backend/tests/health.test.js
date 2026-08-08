// Set test env before requiring app (dotenv won't override already-set vars).
process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

test('GET /api/health returns 200 and status ok', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
  assert.ok('db' in res.body, 'response includes db state');
  assert.ok('uptime' in res.body, 'response includes uptime');
});

test('unknown route returns 404 JSON', async () => {
  const res = await request(app).get('/api/does-not-exist');
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.status, 'error');
});
