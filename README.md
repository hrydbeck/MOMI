# MOMI - Motives of Mount Improbable

A 3D visualization tool for evolutionary concepts, focusing on family pedigrees with biological accuracy including gestation periods, germline visualization, and developmental milestones.

## Features

### Main Visualization (index.html)

- **3D Family Tree**: Interactive Three.js visualization showing multiple generations
- **Time Axis**: Vertical axis represents time, with "BIOSPHERE, NOW" at the top
- **Biological Accuracy**:
  - Conception indicators (yellow bars from father to mother)
  - Gestation stacks (tapered growth inside mother, clickable)
  - Germline substacks (orange glowing indicators for each person)
  - Birth transitions (cyan lines from mother to child position)
- **Visual Distinctions**:
  - Male: Blue rectangles
  - Female: Pink rounded rectangles
  - Deceased: Grey and semi-transparent
  - Germline: Orange (#ffaa00), 15% width of person
- **Interactivity**:
  - Family selection with greying of non-selected families
  - Click on gestation to open detailed birth journey view

### Birth Journey View (birth_view.html)

- **Stretched Timeline**: 9-month gestation period expanded to 15 units vertically
- **40 Segments**: Smooth growth visualization
- **Developmental Milestones**:
  1. Week 5: Heart beating
  2. Week 8: Embryo becomes fetus
  3. Week 13: 1st trimester ends
  4. Week 16: Sex determinable
  5. Week 20: Halfway point
  6. Week 24: Can hear sounds
  7. Week 27: 2nd trimester ends
  8. Week 32: Final growth spurt
  9. Week 40: Full term - birth
- **Trimester Markers**: Visual boundaries at weeks 13 and 27
- **Week Labels**: Every 4 weeks for reference

## Technology Stack

- **Frontend**: Three.js r128 (3D rendering)
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB 7.0
- **Admin UI**: Mongo Express
- **Containerization**: Docker Compose

## Quick Start

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Start API Server

```bash
npm start
```

## Access Points

- **Main App**: http://localhost:3001
- **API Endpoints**: http://localhost:3001/api/persons
- **MongoDB Admin**: http://localhost:8081 (login: admin/admin)
- **Birth View**: http://localhost:3001/birth_view.html

## API Endpoints

### Persons

- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get specific person
- `POST /api/persons` - Create new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Conceptions

- `GET /api/conceptions` - Get all conception connections

### Families

- `GET /api/families` - Get all family metadata

## Database Schema

### Persons Collection

```json
{
  "id": "c1",
  "name": "Michael",
  "sex": "male",
  "birthYear": 1995,
  "birthMonth": 3,
  "motherId": "m1",
  "fatherId": "f1",
  "familyId": "smith",
  "isDeceased": false,
  "deathYear": null
}
```

### Conceptions Collection

```json
{
  "id": "con1",
  "motherId": "m1",
  "fatherId": "f1",
  "childId": "c1",
  "conceptionYear": 1994.5
}
```

### Families Collection

```json
{
  "id": "smith",
  "name": "Smith Family",
  "members": ["gf1", "gm1", "gf2", "gm2", "f1", "m1", "c1", "c2", "c3"],
  "generations": 3,
  "memberCount": 9,
  "oldest": { "name": "Robert", "year": 1938 },
  "youngest": { "name": "Sarah", "year": 1999 }
}
```

## Sample Data

The database includes two families:

### Smith Family (9 members, 3 generations)

- Grandparents: Robert & Mary, William & Margaret
- Parents: James & Jennifer
- Children: Michael, Emily, Sarah

### Chen Family (8 members, 3 generations)

- Grandparents: Tao & Mei, Wei & Lin
- Parents: David & Lisa
- Children: Daniel, Sophie

## Configuration

### Ports

- **MongoDB**: 27019 (external), 27017 (internal)
- **Mongo Express**: 8081
- **API Server**: 3001

### Database Credentials

- **Admin User**: momi_user / momi_password
- **Mongo Express UI**: admin / admin

### Data Storage

Data is persisted in Docker named volumes:

- `momi_momi_mongodb_data` - Database files
- `momi_momi_mongodb_config` - Configuration

## Visualization Details

### Time Scale

- 0.1 units = 1 year in main view
- 15 units = 9 months in birth view (highly stretched)

### Color Coding

- `#ff69b4` - Female (pink)
- `#4169e1` - Male (blue)
- `#ffaa00` - Germline (orange)
- `#ffff00` - Conception bars (yellow)
- `#00ffaa` - Birth transitions (cyan)
- `#888888` - Deceased (grey)

### Layout

- **X-axis**: Family positioning (spacing: 5 units between families)
- **Y-axis**: Time (birth year \* 0.1, present at top)
- **Z-axis**: Not currently used (depth = 0)

## Troubleshooting

### MongoDB Container Restarting

```bash
# Check logs
docker logs momi_mongodb

# If permission errors, ensure using Docker volumes (not Windows mounts)
# Current setup uses named volumes: momi_momi_mongodb_data
```

### Port Conflicts

```bash
# Check which process is using a port
lsof -i :3001
lsof -i :27019
lsof -i :8081
```

### Reset Database

```bash
# Warning: This deletes all data
docker-compose down -v
docker-compose up -d
npm run seed
```

### API Server Issues

```bash
# Check if server is running
curl http://localhost:3001/api/persons

# View server logs
tail -f server.log
```

## Development

### File Structure

```
MOMI/
├── index.html           # Main 3D visualization
├── birth_view.html      # Detailed birth journey view
├── server.js            # Express REST API
├── seed_database.js     # Database seeding script
├── docker-compose.yml   # Container orchestration
├── package.json         # Node.js dependencies
├── README.md            # This file
└── .gitignore          # Git exclusions
```

### Adding New Persons

Via API:

```bash
curl -X POST http://localhost:3001/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "id": "c6",
    "name": "Alex",
    "sex": "male",
    "birthYear": 2020,
    "birthMonth": 6,
    "motherId": "c2",
    "fatherId": null,
    "familyId": "smith",
    "isDeceased": false
  }'
```

Via Mongo Express:

1. Open http://localhost:8081
2. Navigate to momi_db → persons
3. Click "New Document"
4. Enter JSON and save

## Future Enhancements

- [ ] Integrate index.html to fetch from API instead of hardcoded data
- [ ] Add more families and generations
- [ ] Implement genetic trait visualization
- [ ] Add mutation indicators
- [ ] Export/import functionality
- [ ] User authentication
- [ ] Real-time updates via WebSockets

## License

This project is for educational purposes to visualize evolutionary concepts.

## Credits

Inspired by Richard Dawkins' "Climbing Mount Improbable" - exploring how complex biological features can evolve through cumulative selection.
