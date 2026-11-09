# checkin-api

A small Express API for managing members. Data is stored in memory and resets
when the server restarts.

## Run locally

```sh
npm install
npm start
```

The API listens on port `3000` by default. Set the `PORT` environment variable
to use a different port.

## Endpoints

### `GET /members`

Returns all members.

**Example request**

```http
GET /members
```

**Example response**

```json
[
  {
    "id": 1,
    "name": "Aly",
    "phone": "01000000000"
  },
  {
    "id": 2,
    "name": "Sam",
    "phone": "01000000001"
  },
  {
    "id": 3,
    "name": "Maya",
    "phone": "01000000002"
  },
  {
    "id": 4,
    "name": "Omar",
    "phone": "01000000003"
  },
  {
    "id": 5,
    "name": "Nina",
    "phone": "01000000004"
  },
  {
    "id": 6,
    "name": "Liam",
    "phone": "01000000005"
  },
  {
    "id": 7,
    "name": "Zara",
    "phone": "01000000006"
  },
  {
    "id": 8,
    "name": "Noah",
    "phone": "01000000007"
  },
  {
    "id": 9,
    "name": "Lina",
    "phone": "01000000008"
  },
  {
    "id": 10,
    "name": "Adam",
    "phone": "01000000009"
  }
]
```

### `GET /members/:id`

Returns the member with the specified ID.

**Example request**

```http
GET /members/1
```

**Example response**

```json
{
  "id": 1,
  "name": "Aly",
  "phone": "01000000000"
}
```

If the ID does not match a member, the API returns `404`:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Member with id 999 was not found"
  }
}
```

### `POST /members`

Creates a member. `name` must be a string with at least two non-whitespace
characters, and `phone` must be a string of exactly 11 digits.

**Example request**

```http
POST /members
Content-Type: application/json
```

```json
{
  "name": "Sam",
  "phone": "01234567890"
}
```

**Example response** (`201 Created`)

```json
{
  "id": 11,
  "name": "Sam",
  "phone": "01234567890"
}
```

Invalid or missing fields return `400`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "phone must be a string of 11 digits"
  }
}
```

### `POST /checkins`

Creates a check-in for an existing member. The request's `memberId` identifies
the member; the API generates a separate, sequential `id` for each successful
check-in.

**Example request**

```http
POST /checkins
Content-Type: application/json
```

```json
{
  "memberId": 1
}
```

**Example response** (`201 Created`)

```json
{
  "id": 1,
  "memberId": 1,
  "checkedInAt": "2026-11-09T14:53:10.758Z"
}
```

The timestamp in the response is generated when the check-in is created.
Invalid `memberId` values return `400`; IDs for members that do not exist return `404`.

### `GET /members/:id/checkins`

Returns all check-ins for the specified member, newest first. A member with no
check-ins receives an empty array.

**Example request**

```http
GET /members/1/checkins
```

**Example response** (`200 OK`)

```json
[
  {
    "id": 1,
    "memberId": 1,
    "checkedInAt": "2026-11-09T14:53:10.758Z"
  }
]
```

## Status codes

- **200 OK** — The request succeeded (for example, listing members or check-ins).
- **201 Created** — A member or check-in was created successfully.
- **400 Bad Request** — The request contains invalid input, such as a malformed
  ID, missing check-in body, or invalid member fields.
- **404 Not Found** — The requested route or member does not exist.
