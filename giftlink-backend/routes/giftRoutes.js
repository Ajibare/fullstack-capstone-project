// router.get('/', async (req, res) => {
//     try {
//         // Task 1: Connect to MongoDB and store connection to db constant
//         // const db = {{insert code here}}

//         // Task 2: use the collection() method to retrieve the gift collection
//         // {{insert code here}}

//         // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
//         // const gifts = {{insert code here}}

//         // Task 4: return the gifts using the res.json method
//         res.json(/* {{insert code here}} */);
//     } catch (e) {
//         console.error('Error fetching gifts:', e);
//         res.status(500).send('Error fetching gifts');
//     }
// });

// router.get('/:id', async (req, res) => {
//     try {
//         // Task 1: Connect to MongoDB and store connection to db constant
//         // const db = {{insert code here}}

//         // Task 2: use the collection() method to retrieve the gift collection
//         // {{insert code here}}

//         const id = req.params.id;

//         // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
//         // {{insert code here}}

//         if (!gift) {
//             return res.status(404).send('Gift not found');
//         }

//         res.json(gift);
//     } catch (e) {
//         console.error('Error fetching gift:', e);
//         res.status(500).send('Error fetching gift');
//     }
// });



// // Add a new gift
// router.post('/', async (req, res, next) => {
//     try {
//         const db = await connectToDatabase();
//         const collection = db.collection("gifts");
//         const gift = await collection.insertOne(req.body);

//         res.status(201).json(gift.ops[0]);
//     } catch (e) {
//         next(e);
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// GET /api/gifts — Retrieve all gifts
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts');

        // Task 3: Fetch all gifts using the collection.find method and convert to array
        const gifts = await collection.find({}).toArray();

        // Task 4: Return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

// GET /api/gifts/:id — Retrieve a single gift by ID
router.get('/:id', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Get collection
        const collection = db.collection('gifts');

        const id = req.params.id;

        // Task 3: Find gift by id (Note: id in DB is a string, not ObjectId)
        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// POST /api/gifts — Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        const result = await collection.insertOne(req.body);

        res.status(201).json(result.ops ? result.ops[0] : result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
