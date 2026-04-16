# Backend Wizards Stage 1

This project implements the Backend Wizards Stage 1 task: Data Persistence & API Design Assessment. It creates a REST API that accepts a name, fetches data from three external APIs (Genderize, Agify, Nationalize), applies classification logic, stores the result in a MongoDB database, and exposes endpoints to manage the data.

## Features

- **Profile Creation**: Accepts a name, fetches gender, age, and nationality data, classifies age group and selects top country by probability.
- **Idempotency**: Prevents duplicate profiles by checking existing names.
- **Filtering**: Supports case-insensitive filtering on gender, country_id, and age_group.
- **Error Handling**: Proper HTTP status codes for various error scenarios (400, 404, 422, 500, 502).
- **CORS**: Enabled for all origins.
- **Data Persistence**: Uses MongoDB with Mongoose for storage.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **HTTP Client**: Axios
- **Other**: UUID v7, CORS, dotenv

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd backend-wizards-stage1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   MONGO_URI=mongodb://localhost:27017/backend-wizards-stage1
   ```

4. Start the server:
   ```bash
   npm run dev  # For development (with nodemon)
   # or
   npm start    # For production
   ```

The server will run on `http://localhost:3000` (or the port set in `PORT` env var).

## API Endpoints

### Create Profile
- **POST** `/api/profiles`
- **Request Body**:
  ```json
  {
    "name": "ella"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "uuid-v7",
      "name": "ella",
      "gender": "female",
      "gender_probability": 0.99,
      "sample_size": 1234,
      "age": 46,
      "age_group": "adult",
      "country_id": "DRC",
      "country_probability": 0.85,
      "created_at": "2026-04-01T12:00:00Z"
    }
  }
  ```
- **Duplicate Response (200)**:
  ```json
  {
    "status": "success",
    "message": "Profile already exists",
    "data": { ...existing profile... }
  }
  ```

### Get All Profiles
- **GET** `/api/profiles`
- **Optional Query Params**: `gender`, `country_id`, `age_group` (case-insensitive)
- **Example**: `/api/profiles?gender=female&country_id=CM`
- **Success Response (200)**:
  ```json
  {
    "status": "success",
    "count": 2,
    "data": [
      {
        "id": "id-1",
        "name": "emmanuel",
        "gender": "male",
        "age": 25,
        "age_group": "adult",
        "country_id": "NG"
      }
    ]
  }
  ```

### Get Profile by ID
- **GET** `/api/profiles/:id`
- **Success Response (200)**: Same as create data object.

### Delete Profile
- **DELETE** `/api/profiles/:id`
- **Success Response (204)**: No content.

## Error Responses

All errors follow:
```json
{
  "status": "error",
  "message": "<error message>"
}
```

- **400**: Missing or empty name
- **422**: Invalid type
- **404**: Profile not found
- **502**: External API returned invalid response (e.g., "Genderize returned an invalid response")
- **500**: Internal server error

## Classification Rules

- **Age Group**: 0–12 → child, 13–19 → teenager, 20–59 → adult, 60+ → senior
- **Nationality**: Country with highest probability from Nationalize API

## Tested Endpoints

Here’s the **clean list of all tested endpoints**:

---

## 🧪 Tested Endpoints (Stage 1)

* POST `/api/profiles`
* GET `/api/profiles`
* GET `/api/profiles?gender=female`
* GET `/api/profiles?gender=female&country_id=CM`
* GET `/api/profiles?gender=FeMaLe`
* GET `/api/profiles/:id`
* DELETE `/api/profiles/:id`

## Deployment

This app can be deployed to platforms like Heroku, Railway, or Vercel. Ensure the `MONGO_URI` is set in the environment variables. The app listens on the port provided by the platform (default 3000).

## License

ISC
