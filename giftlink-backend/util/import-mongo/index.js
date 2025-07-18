require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
  const express = require('express');
const app = express();
const giftsRouter = require('./routes/gifts'); 

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;
let filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected successfully to server");

        // database will be created if it does not exist
        const db = client.db(dbName);

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = await collection.find({});
        let documents = await cursor.toArray();

        if(documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log("Gifts already exists in DB")
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

loadData();

module.exports = {
    loadData,
  };

// adjust path if needed

// Middleware to parse JSON
app.use(express.json());

// Mount the /api/gifts route
app.use('/api/gifts', giftsRouter);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('GiftLink Backend is running ✅');
});

// Start the server (if app.js is the entry file)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
