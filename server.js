const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001; // Changed from 3000 (in use)

// MongoDB connection
const url = 'mongodb://momi_user:momi_password@localhost:27019';
const dbName = 'momi_db';
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
