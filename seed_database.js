const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://momi_user:momi_password@localhost:27019';
const dbName = 'momi_db';

// Family data from index.html
const familyData = [
    // ===== FAMILY 1 - Smith Family (3 generations) =====
    // Generation 1 - Grandparents (oldest first, z=-8, two generations back)
    { id: 'gf1', name: 'John Sr.', sex: 'M', birthYear: 1940, birthMonth: 3, deathYear: 2015, x: -4, z: -8 },
    { id: 'gm1', name: 'Mary', sex: 'F', birthYear: 1942, birthMonth: 7, deathYear: 2018, x: -2, z: -8 },
    { id: 'gf2', name: 'Robert', sex: 'M', birthYear: 1938, birthMonth: 1, deathYear: 2010, x: 2, z: -8 },
    { id: 'gm2', name: 'Patricia', sex: 'F', birthYear: 1941, birthMonth: 11, deathYear: null, x: 4, z: -8 },
    
    // Generation 2 - Parents (z=-4, one generation back)
    { id: 'f1', name: 'John Jr.', sex: 'M', birthYear: 1965, birthMonth: 5, deathYear: null, x: -3, z: -4, motherId: 'gm1' },
    { id: 'm1', name: 'Susan', sex: 'F', birthYear: 1968, birthMonth: 9, deathYear: null, x: 3, z: -4, motherId: 'gm2' },
    
    // Generation 3 - Children (youngest, z=0, closest to viewer)
    { id: 'c1', name: 'Michael', sex: 'M', birthYear: 1995, birthMonth: 3, deathYear: null, x: -2, z: 0, motherId: 'm1' },
    { id: 'c2', name: 'Emily', sex: 'F', birthYear: 1997, birthMonth: 2, deathYear: null, x: 0, z: 0, motherId: 'm1' },
    { id: 'c3', name: 'Sarah', sex: 'F', birthYear: 1999, birthMonth: 6, deathYear: null, x: 2, z: 0, motherId: 'm1' },

    // ===== FAMILY 2 - Chen Family (3 generations) =====
    // Generation 1 - Grandparents (z=-8, two generations back)
    { id: 'gf3', name: 'Wei', sex: 'M', birthYear: 1945, birthMonth: 8, deathYear: 2020, x: 8, z: -8 },
    { id: 'gm3', name: 'Ling', sex: 'F', birthYear: 1947, birthMonth: 4, deathYear: null, x: 10, z: -8 },
    { id: 'gf4', name: 'Tao', sex: 'M', birthYear: 1943, birthMonth: 12, deathYear: 2019, x: 14, z: -8 },
    { id: 'gm4', name: 'Mei', sex: 'F', birthYear: 1946, birthMonth: 6, deathYear: null, x: 16, z: -8 },
    
    // Generation 2 - Parents (z=-4, one generation back)
    { id: 'f2', name: 'David', sex: 'M', birthYear: 1970, birthMonth: 3, deathYear: null, x: 9, z: -4, motherId: 'gm3' },
    { id: 'm2', name: 'Li', sex: 'F', birthYear: 1972, birthMonth: 10, deathYear: null, x: 15, z: -4, motherId: 'gm4' },
    
    // Generation 3 - Children (youngest, z=0, aligned with Smith's youngest)
    { id: 'c4', name: 'Alex', sex: 'M', birthYear: 2000, birthMonth: 5, deathYear: null, x: 10, z: 0, motherId: 'm2' },
    { id: 'c5', name: 'Maya', sex: 'F', birthYear: 2003, birthMonth: 1, deathYear: null, x: 12, z: 0, motherId: 'm2' },
];

const conceptions = [
    // ===== FAMILY 1 - Smith Family =====
    { father: 'gf1', mother: 'gm1', child: 'f1' },
    { father: 'gf2', mother: 'gm2', child: 'm1' },
    { father: 'f1', mother: 'm1', child: 'c1' },
    { father: 'f1', mother: 'm1', child: 'c2' },
    { father: 'f1', mother: 'm1', child: 'c3' },
    
    // ===== FAMILY 2 - Chen Family =====
    { father: 'gf3', mother: 'gm3', child: 'f2' },
    { father: 'gf4', mother: 'gm4', child: 'm2' },
    { father: 'f2', mother: 'm2', child: 'c4' },
    { father: 'f2', mother: 'm2', child: 'c5' },
];

const familyMembers = {
    smith: ['gf1', 'gm1', 'gf2', 'gm2', 'f1', 'm1', 'c1', 'c2', 'c3'],
    chen: ['gf3', 'gm3', 'gf4', 'gm4', 'f2', 'm2', 'c4', 'c5']
};

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
        
        console.log('Cleared existing data');

        // Insert persons
        const personsResult = await db.collection('persons').insertMany(familyData);
        console.log(`Inserted ${personsResult.insertedCount} persons`);

        // Insert conceptions
        const conceptionsResult = await db.collection('conceptions').insertMany(conceptions);
        console.log(`Inserted ${conceptionsResult.insertedCount} conceptions`);

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
