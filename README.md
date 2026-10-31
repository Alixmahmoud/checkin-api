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
  "id": 2,
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
