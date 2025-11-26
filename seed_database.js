const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://mongo:VaBtkOtVaUBGxPaayFfxdwrHQtNNqWSi@metro.proxy.rlwy.net:35683';
const dbName = 'momi_db';

// Family data from index.html
const familyData = [
    // ===== FAMILY 1 - Smith Family (3 generations) =====
    // Generation 1 - Grandparents (oldest first, z=-8, two generations back)
    { id: 'gf1', name: 'John Sr.', sex: 'male', birthYear: 1940, birthMonth: 3, deathYear: 2015, x: -4, z: -8, familyId: 'smith', isDeceased: true },
    { id: 'gm1', name: 'Mary', sex: 'female', birthYear: 1942, birthMonth: 7, deathYear: 2018, x: -2, z: -8, familyId: 'smith', isDeceased: true },
    { id: 'gf2', name: 'Robert', sex: 'male', birthYear: 1938, birthMonth: 1, deathYear: 2010, x: 2, z: -8, familyId: 'smith', isDeceased: true },
    { id: 'gm2', name: 'Patricia', sex: 'female', birthYear: 1941, birthMonth: 11, deathYear: null, x: 4, z: -8, familyId: 'smith', isDeceased: false },
    
    // Generation 2 - Parents (z=-4, one generation back)
    { id: 'f1', name: 'John Jr.', sex: 'male', birthYear: 1965, birthMonth: 5, deathYear: null, x: -3, z: -4, motherId: 'gm1', fatherId: 'gf1', familyId: 'smith', isDeceased: false },
    { id: 'm1', name: 'Susan', sex: 'female', birthYear: 1968, birthMonth: 9, deathYear: null, x: 3, z: -4, motherId: 'gm2', fatherId: 'gf2', familyId: 'smith', isDeceased: false },
    
    // Generation 3 - Children (youngest, z=0, closest to viewer)
    { id: 'c1', name: 'Michael', sex: 'male', birthYear: 1995, birthMonth: 3, deathYear: null, x: -2, z: 0, motherId: 'm1', fatherId: 'f1', familyId: 'smith', isDeceased: false },
    { id: 'c2', name: 'Emily', sex: 'female', birthYear: 1997, birthMonth: 2, deathYear: null, x: 0, z: 0, motherId: 'm1', fatherId: 'f1', familyId: 'smith', isDeceased: false },
    { id: 'c3', name: 'Sarah', sex: 'female', birthYear: 1999, birthMonth: 6, deathYear: null, x: 2, z: 0, motherId: 'm1', fatherId: 'f1', familyId: 'smith', isDeceased: false },

    // ===== FAMILY 2 - Chen Family (3 generations) =====
    // Generation 1 - Grandparents (z=-8, two generations back)
    { id: 'gf3', name: 'Wei', sex: 'male', birthYear: 1945, birthMonth: 8, deathYear: 2020, x: 8, z: -8, familyId: 'chen', isDeceased: true },
    { id: 'gm3', name: 'Ling', sex: 'female', birthYear: 1947, birthMonth: 4, deathYear: null, x: 10, z: -8, familyId: 'chen', isDeceased: false },
    { id: 'gf4', name: 'Tao', sex: 'male', birthYear: 1943, birthMonth: 12, deathYear: 2019, x: 14, z: -8, familyId: 'chen', isDeceased: true },
    { id: 'gm4', name: 'Mei', sex: 'female', birthYear: 1946, birthMonth: 6, deathYear: null, x: 16, z: -8, familyId: 'chen', isDeceased: false },
    
    // Generation 2 - Parents (z=-4, one generation back)
    { id: 'f2', name: 'David', sex: 'male', birthYear: 1970, birthMonth: 3, deathYear: null, x: 9, z: -4, motherId: 'gm3', fatherId: 'gf3', familyId: 'chen', isDeceased: false },
    { id: 'm2', name: 'Li', sex: 'female', birthYear: 1972, birthMonth: 10, deathYear: null, x: 15, z: -4, motherId: 'gm4', fatherId: 'gf4', familyId: 'chen', isDeceased: false },
    
    // Generation 3 - Children (youngest, z=0, aligned with Smith's youngest)
    { id: 'c4', name: 'Alex', sex: 'male', birthYear: 2000, birthMonth: 5, deathYear: null, x: 10, z: 0, motherId: 'm2', fatherId: 'f2', familyId: 'chen', isDeceased: false },
    { id: 'c5', name: 'Maya', sex: 'female', birthYear: 2003, birthMonth: 1, deathYear: null, x: 12, z: 0, motherId: 'm2', fatherId: 'f2', familyId: 'chen', isDeceased: false },
];

const conceptions = [
    // ===== FAMILY 1 - Smith Family =====
    { id: 'con1', fatherId: 'gf1', motherId: 'gm1', childId: 'f1', conceptionYear: 1964.583 },
    { id: 'con2', fatherId: 'gf2', motherId: 'gm2', childId: 'm1', conceptionYear: 1967.917 },
    { id: 'con3', fatherId: 'f1', motherId: 'm1', childId: 'c1', conceptionYear: 1994.5 },
    { id: 'con4', fatherId: 'f1', motherId: 'm1', childId: 'c2', conceptionYear: 1996.417 },
    { id: 'con5', fatherId: 'f1', motherId: 'm1', childId: 'c3', conceptionYear: 1998.75 },
    
    // ===== FAMILY 2 - Chen Family =====
    { id: 'con6', fatherId: 'gf3', motherId: 'gm3', childId: 'f2', conceptionYear: 1969.5 },
    { id: 'con7', fatherId: 'gf4', motherId: 'gm4', childId: 'm2', conceptionYear: 1972.083 },
    { id: 'con8', fatherId: 'f2', motherId: 'm2', childId: 'c4', conceptionYear: 1999.667 },
    { id: 'con9', fatherId: 'f2', motherId: 'm2', childId: 'c5', conceptionYear: 2002.333 },
];

const familyMembers = {
    smith: ['gf1', 'gm1', 'gf2', 'gm2', 'f1', 'm1', 'c1', 'c2', 'c3'],
    chen: ['gf3', 'gm3', 'gf4', 'gm4', 'f2', 'm2', 'c4', 'c5']
};

// Life events - diseases, medical conditions, significant life events
const lifeEvents = [
    // Smith Family events
    { id: 'evt1', personId: 'gf1', eventType: 'disease', name: 'Diabetes Type 2', onsetYear: 1985, severity: 'moderate', description: 'Diagnosed with Type 2 Diabetes' },
    { id: 'evt2', personId: 'gf1', eventType: 'disease', name: 'Heart Disease', onsetYear: 2010, severity: 'severe', description: 'Coronary artery disease' },
    { id: 'evt3', personId: 'gm1', eventType: 'disease', name: 'Osteoporosis', onsetYear: 2000, severity: 'moderate', description: 'Bone density loss' },
    { id: 'evt4', personId: 'f1', eventType: 'disease', name: 'Hypertension', onsetYear: 2015, severity: 'mild', description: 'High blood pressure' },
    { id: 'evt5', personId: 'c1', eventType: 'disease', name: 'Asthma', onsetYear: 2005, severity: 'mild', description: 'Childhood asthma' },
    { id: 'evt6', personId: 'c2', eventType: 'milestone', name: 'Graduate Degree', onsetYear: 2020, severity: 'positive', description: 'Completed Masters degree' },
    
    // Chen Family events
    { id: 'evt7', personId: 'gf3', eventType: 'disease', name: 'Cancer', onsetYear: 2018, severity: 'severe', description: 'Lung cancer diagnosis' },
    { id: 'evt8', personId: 'gm3', eventType: 'disease', name: 'Arthritis', onsetYear: 2010, severity: 'moderate', description: 'Rheumatoid arthritis' },
    { id: 'evt9', personId: 'm2', eventType: 'disease', name: 'Migraine', onsetYear: 2010, severity: 'mild', description: 'Chronic migraines' },
    { id: 'evt10', personId: 'c4', eventType: 'disease', name: 'Allergies', onsetYear: 2008, severity: 'mild', description: 'Seasonal allergies' },
];

async function seedDatabase() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        
        // Clear existing data
        await db.collection('persons').deleteMany({});
        await db.collection('conceptions').deleteMany({});
        await db.collection('families').deleteMany({});
        await db.collection('lifeEvents').deleteMany({});
        
        console.log('Cleared existing data');

        // Insert persons
        const personsResult = await db.collection('persons').insertMany(familyData);
        console.log(`Inserted ${personsResult.insertedCount} persons`);

        // Insert conceptions
        const conceptionsResult = await db.collection('conceptions').insertMany(conceptions);
        console.log(`Inserted ${conceptionsResult.insertedCount} conceptions`);
        
        // Insert life events
        const lifeEventsResult = await db.collection('lifeEvents').insertMany(lifeEvents);
        console.log(`Inserted ${lifeEventsResult.insertedCount} life events`);

        // Insert family metadata
        const families = [
            {
                id: 'smith',
                name: 'Smith Family',
                members: familyMembers.smith,
                generations: 3,
                memberCount: 9,
                oldest: { name: 'Robert', year: 1938 },
                youngest: { name: 'Sarah', year: 1999 }
            },
            {
                id: 'chen',
                name: 'Chen Family',
                members: familyMembers.chen,
                generations: 3,
                memberCount: 8,
                oldest: { name: 'Tao', year: 1943 },
                youngest: { name: 'Maya', year: 2003 }
            }
        ];

        const familiesResult = await db.collection('families').insertMany(families);
        console.log(`Inserted ${familiesResult.insertedCount} families`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\nYou can view the data at: http://localhost:8081');
        console.log('Login: admin / admin');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();
