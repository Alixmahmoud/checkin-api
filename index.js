const express = require('express');

const app = express();
app.use(express.json());

const members = [{ id: 1, name: 'Aly', phone: '01000000000' }];

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
    id: members.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1,
    name: name.trim(),
    phone,
  };
  members.push(member);

  return res.status(201).json(member);
});

app.use((req, res) => {
  sendError(res, 404, 'NOT_FOUND', `No route ${req.method} ${req.path}`);
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
