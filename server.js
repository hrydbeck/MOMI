const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection - use environment variable for Railway/cloud deployment
const url = process.env.MONGODB_URL || 'mongodb://momi_user:momi_password@localhost:27019';
const dbName = process.env.MONGODB_DB || 'momi_db';
const client = new MongoClient(url);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Connect to MongoDB
let db;
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// API Routes

// Get all persons
app.get('/api/persons', async (req, res) => {
    try {
        const persons = await db.collection('persons').find({}).toArray();
        res.json(persons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all conceptions
app.get('/api/conceptions', async (req, res) => {
    try {
        const conceptions = await db.collection('conceptions').find({}).toArray();
        res.json(conceptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all families
app.get('/api/families', async (req, res) => {
    try {
        const families = await db.collection('families').find({}).toArray();
        res.json(families);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all life events
app.get('/api/lifeEvents', async (req, res) => {
    try {
        const lifeEvents = await db.collection('lifeEvents').find({}).toArray();
        res.json(lifeEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get life events for a specific person
app.get('/api/lifeEvents/person/:personId', async (req, res) => {
    try {
        const events = await db.collection('lifeEvents').find({ personId: req.params.personId }).toArray();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new life event
app.post('/api/lifeEvents', async (req, res) => {
    try {
        const result = await db.collection('lifeEvents').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific person by ID
app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await db.collection('persons').findOne({ id: req.params.id });
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new person
app.post('/api/persons', async (req, res) => {
    try {
        const result = await db.collection('persons').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update person
app.put('/api/persons/:id', async (req, res) => {
    try {
        const result = await db.collection('persons').updateOne(
            { id: req.params.id },
            { $set: req.body }
        );
        if (result.matchedCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete person
app.delete('/api/persons/:id', async (req, res) => {
    try {
        const result = await db.collection('persons').deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============ IMPORT/EXPORT API ROUTES ============

// Clear all data and import new pedigree from .ped format
app.post('/api/import/ped', async (req, res) => {
    try {
        const { persons, conceptions, families, familyMembers } = req.body;
        
        // Clear existing data
        await db.collection('persons').deleteMany({});
        await db.collection('conceptions').deleteMany({});
        await db.collection('families').deleteMany({});
        
        // Insert new data
        if (persons && persons.length > 0) {
            await db.collection('persons').insertMany(persons);
        }
        if (conceptions && conceptions.length > 0) {
            await db.collection('conceptions').insertMany(conceptions);
        }
        if (families && families.length > 0) {
            await db.collection('families').insertMany(families);
        }
        
        res.json({ success: true, imported: persons?.length || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import life events and update DOB/DOD
app.post('/api/import/tsv', async (req, res) => {
    try {
        const { events, personUpdates } = req.body;
        
        // Update persons with DOB/DOD
        if (personUpdates && personUpdates.length > 0) {
            for (const update of personUpdates) {
                await db.collection('persons').updateOne(
                    { id: update.id },
                    { $set: { birthYear: update.birthYear, birthMonth: update.birthMonth, deathYear: update.deathYear } }
                );
            }
        }
        
        // Clear and insert life events
        if (events && events.length > 0) {
            // Get person IDs being updated
            const personIds = events.map(e => e.personId);
            await db.collection('lifeEvents').deleteMany({ personId: { $in: personIds } });
            await db.collection('lifeEvents').insertMany(events);
        }
        
        res.json({ success: true, eventsImported: events?.length || 0, personsUpdated: personUpdates?.length || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export all data as structured JSON
app.get('/api/export/all', async (req, res) => {
    try {
        const persons = await db.collection('persons').find({}).toArray();
        const conceptions = await db.collection('conceptions').find({}).toArray();
        const families = await db.collection('families').find({}).toArray();
        const lifeEvents = await db.collection('lifeEvents').find({}).toArray();
        
        res.json({ persons, conceptions, families, lifeEvents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ END IMPORT/EXPORT API ROUTES ============

// Start server
app.listen(port, () => {
    console.log(`\n✅ MOMI Server running!`);
    console.log(`   Main app: http://localhost:${port}`);
    console.log(`   API docs: http://localhost:${port}/api/persons`);
    console.log(`   MongoDB Admin: http://localhost:8081 (admin/admin)\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await client.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
});
