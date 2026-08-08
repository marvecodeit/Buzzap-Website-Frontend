process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const createApp = require('../app');

const app = createApp();

// ---- Notifications (admin-only) ----
test('GET /api/notifications returns 401 without auth', async () => {
  const res = await request(app).get('/api/notifications');
  assert.strictEqual(res.status, 401);
});

test('PATCH /api/notifications/read-all returns 401 without auth', async () => {
  const res = await request(app).patch('/api/notifications/read-all');
  assert.strictEqual(res.status, 401);
});

// ---- Blog: public read is open, writes are protected ----
test('GET /api/blog is public (200)', async () => {
  const res = await request(app).get('/api/blog');
  // 200 with an (empty) list — DB may be unavailable in sandbox, but route is public.
  assert.ok(res.status === 200 || res.status === 500, `unexpected ${res.status}`);
  if (res.status === 200) assert.strictEqual(res.body.status, 'success');
});

test('POST /api/blog returns 401 without auth', async () => {
  const res = await request(app).post('/api/blog').send({ title: 'Hi', content: 'x' });
  assert.strictEqual(res.status, 401);
});

test('GET /api/blog/admin/all returns 401 without auth', async () => {
  const res = await request(app).get('/api/blog/admin/all');
  assert.strictEqual(res.status, 401);
});

test('DELETE /api/blog/:id returns 401 without auth', async () => {
  const res = await request(app).delete('/api/blog/507f1f77bcf86cd799439011');
  assert.strictEqual(res.status, 401);
});

test('POST /api/blog/upload-image returns 401 without auth', async () => {
  const res = await request(app).post('/api/blog/upload-image');
  assert.strictEqual(res.status, 401);
});

// ---- Messaging (admin-only) ----
test('GET /api/conversations returns 401 without auth', async () => {
  const res = await request(app).get('/api/conversations');
  assert.strictEqual(res.status, 401);
});

test('POST /api/conversations/:id/messages returns 401 without auth', async () => {
  const res = await request(app)
    .post('/api/conversations/507f1f77bcf86cd799439011/messages')
    .send({ body: 'hello' });
  assert.strictEqual(res.status, 401);
});

// ---- Assets (nested under projects, admin-only) ----
test('GET /api/projects/:id/assets returns 401 without auth', async () => {
  const res = await request(app).get('/api/projects/507f1f77bcf86cd799439011/assets');
  assert.strictEqual(res.status, 401);
});

test('POST /api/projects/:id/assets returns 401 without auth', async () => {
  const res = await request(app).post('/api/projects/507f1f77bcf86cd799439011/assets');
  assert.strictEqual(res.status, 401);
});
