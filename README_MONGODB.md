# MOMI - MongoDB Setup

## Prerequisites

- Docker and Docker Compose installed

## Quick Start

### 1. Start MongoDB Container

```bash
docker-compose up -d
```

This will start:

- MongoDB on port 27019 (data stored in /mnt/e/MOMI_large_files/mongodb_data)
- Mongo Express (web UI) on port 8081

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Seed the Database

```bash
npm run seed
```

This populates MongoDB with the Smith and Chen family data.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 5. Access the Application

- **Main App**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081 (login: admin/admin)
- **API Endpoint**: http://localhost:3000/api/persons

## API Endpoints

### Persons

- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get specific person
- `POST /api/persons` - Add new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Conceptions

- `GET /api/conceptions` - Get all conception connections

### Families

- `GET /api/families` - Get all families metadata

## Database Collections

### persons

```json
{
  "id": "c1",
  "name": "Michael",
  "sex": "M",
  "birthYear": 1995,
  "birthMonth": 3,
  "deathYear": null,
  "x": -2,
  "z": 0,
  "motherId": "m1"
}
```

### conceptions

```json
{
  "father": "f1",
  "mother": "m1",
  "child": "c1"
}
```

### families

```json
{
  "id": "smith",
  "name": "Smith Family",
  "members": ["gf1", "gm1", ...],
  "generations": 3,
  "memberCount": 9
}
```

## Stopping Services

```bash
docker-compose down
```

## Data Storage

All MongoDB data is stored on the E: drive at:

- `/mnt/e/MOMI_large_files/mongodb_data` - Database files
- `/mnt/e/MOMI_large_files/mongodb_config` - Configuration

This keeps your Linux filesystem from filling up.
