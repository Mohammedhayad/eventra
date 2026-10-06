import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000'

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  return { status: response.status, body }
}

const postJson = (path, data) =>
  request(path, { method: 'POST', body: JSON.stringify(data) })

test('health check reports the database as connected', async () => {
  const { status, body } = await request('/api/health')
  assert.equal(status, 200)
  assert.equal(body.database, 'connected')
})

test('events list is public', async () => {
  const { status, body } = await request('/api/events')
  assert.equal(status, 200)
  assert.ok(Array.isArray(body.events))
})

test('categories list includes Cultural', async () => {
  const { status, body } = await request('/api/events/categories')
  assert.equal(status, 200)
  assert.ok(body.categories.includes('Cultural'))
})

test('a malformed event id is rejected', async () => {
  const { status } = await request('/api/events/not-an-id')
  assert.equal(status, 400)
})

test('registration with a non-college email is rejected', async () => {
  const { status, body } = await postJson('/api/auth/register', {
    name: 'Test User',
    email: 'someone@gmail.com',
    password: 'test1234',
  })
  assert.equal(status, 400)
  assert.match(body.message, /college mail/i)
})

test('login with a non-college email is rejected', async () => {
  const { status, body } = await postJson('/api/auth/login', {
    email: 'someone@gmail.com',
    password: 'test1234',
  })
  assert.equal(status, 400)
  assert.match(body.message, /college mail/i)
})

test('login rejects an injection-style email object', async () => {
  const { status } = await postJson('/api/auth/login', {
    email: { $ne: null },
    password: 'x',
  })
  assert.equal(status, 400)
})

test('a fake token is rejected', async () => {
  const { status } = await request('/api/auth/me', {
    headers: { Authorization: 'Bearer abc.def.ghi' },
  })
  assert.equal(status, 401)
})

test('creating an event without logging in is blocked', async () => {
  const { status } = await postJson('/api/events', { title: 'Sneaky event' })
  assert.equal(status, 401)
})

test('registering for an event without logging in is blocked', async () => {
  const { status } = await postJson('/api/events/507f1f77bcf86cd799439011/register', {})
  assert.equal(status, 401)
})

test('creating a payment order without logging in is blocked', async () => {
  const { status } = await postJson('/api/payments/create-order', {
    eventId: '507f1f77bcf86cd799439011',
  })
  assert.equal(status, 401)
})

test('check-in without logging in is blocked', async () => {
  const { status } = await postJson('/api/checkin', { registrationCode: 'abc' })
  assert.equal(status, 401)
})

test('admin analytics without logging in is blocked', async () => {
  const { status } = await request('/api/admin/analytics')
  assert.equal(status, 401)
})

test('admin users list without logging in is blocked', async () => {
  const { status } = await request('/api/admin/users')
  assert.equal(status, 401)
})

test('an unknown route returns 404', async () => {
  const { status } = await request('/api/does-not-exist')
  assert.equal(status, 404)
})