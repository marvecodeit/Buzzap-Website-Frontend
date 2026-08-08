process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// All /api/projects routes require auth — unauthenticated requests get 401.
test('GET /api/projects returns 401 without auth', async () => {
  const res = await request(app).get('/api/projects');
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.status, 'error');
});

test('POST /api/projects returns 401 without auth', async () => {
  const res = await request(app)
    .post('/api/projects')
    .send({ title: 'Test', client: '507f1f77bcf86cd799439011' });
  assert.strictEqual(res.status, 401);
});

test('GET /api/projects/:id returns 401 without auth', async () => {
  const res = await request(app).get('/api/projects/507f1f77bcf86cd799439011');
  assert.strictEqual(res.status, 401);
});

test('PATCH /api/projects/:id returns 401 without auth', async () => {
  const res = await request(app)
    .patch('/api/projects/507f1f77bcf86cd799439011')
    .send({ status: 'completed' });
  assert.strictEqual(res.status, 401);
});

test('DELETE /api/projects/:id returns 401 without auth', async () => {
  const res = await request(app).delete('/api/projects/507f1f77bcf86cd799439011');
  assert.strictEqual(res.status, 401);
});

test('GET /api/projects/:id/milestones returns 401 without auth', async () => {
  const res = await request(app).get('/api/projects/507f1f77bcf86cd799439011/milestones');
  assert.strictEqual(res.status, 401);
});

test('POST /api/projects/:id/milestones returns 401 without auth', async () => {
  const res = await request(app)
    .post('/api/projects/507f1f77bcf86cd799439011/milestones')
    .send({ title: 'Kickoff' });
  assert.strictEqual(res.status, 401);
});

// Auth cookie present but invalid → still 401 (verifies protect rejects bad tokens).
test('GET /api/projects with invalid token cookie returns 401', async () => {
  const res = await request(app)
    .get('/api/projects')
    .set('Cookie', 'buzzap_token=not-a-real-jwt');
  assert.strictEqual(res.status, 401);
});
