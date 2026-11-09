const express = require('express');

const app = express();
app.use(express.json());

const members = [
  { id: 1, name: 'Aly', phone: '01000000000' },
  { id: 2, name: 'Sam', phone: '01000000001' },
  { id: 3, name: 'Maya', phone: '01000000002' },
  { id: 4, name: 'Omar', phone: '01000000003' },
  { id: 5, name: 'Nina', phone: '01000000004' },
  { id: 6, name: 'Liam', phone: '01000000005' },
  { id: 7, name: 'Zara', phone: '01000000006' },
  { id: 8, name: 'Noah', phone: '01000000007' },
  { id: 9, name: 'Lina', phone: '01000000008' },
  { id: 10, name: 'Adam', phone: '01000000009' },
];
const checkins = [];

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

app.get('/members', (req, res) => {
  res.status(200).json(members);
});

app.get('/members/:id', (req, res) => {
  const id = Number(req.params.id);
  const member = members.find((item) => item.id === id);

  if (!Number.isInteger(id) || id <= 0) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'id must be a valid integer');
  }

  if (!member) {
    return sendError(res, 404, 'NOT_FOUND', `Member with id ${req.params.id} was not found`);
  }

  return res.status(200).json(member);
});

app.post('/members', (req, res) => {
  const { name, phone } = req.body || {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'name must be at least 2 characters');
  }

  if (typeof phone !== 'string' || !/^\d{11}$/.test(phone)) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'phone must be a string of 11 digits');
  }

  const member = {
    id: members.length > 0 ? members[members.length - 1].id + 1 : 1,
    name: name.trim(),
    phone,
  };
  members.push(member);

  return res.status(201).json(member);
});

app.post('/checkins', (req, res) => {

  const { memberId } = req.body || {};

  if (!memberId || !Number.isInteger(memberId) || memberId <= 0) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'memberId must be a valid integer');
  }

  const member = members.find((item) => item.id === memberId);
  if (!member) {
    return sendError(res, 404, 'NOT_FOUND', `Member with id ${memberId} was not found`);
  }

  const checkin = {
    id: checkins.length > 0 ? checkins[checkins.length - 1].id + 1 : 1,
    memberId,
    checkedInAt: new Date().toISOString(),
  };
  checkins.push(checkin);

  return res.status(201).json(checkin);
});

app.get('/members/:id/checkins', (req, res) => {
  const id = Number(req.params.id);

  if (!id || !Number.isInteger(id) || id <= 0) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'id must be a valid integer');
  }

  const member = members.find((item) => item.id === id);
  if (!member) {
    return sendError(res, 404, 'NOT_FOUND', `Member with id ${id} was not found`);
  }

  const memberCheckins = checkins.filter((item) => item.memberId === id);
  memberCheckins.sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt));
  return res.status(200).json(memberCheckins);
});

app.use((req, res) => {
  return sendError(res, 404, 'NOT_FOUND', 'Route not found');
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Request body must be valid JSON');
  }

  console.error(err);
  return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API on http://localhost:${port}`);
  });
}

module.exports = app;
