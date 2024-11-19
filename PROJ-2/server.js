const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173/', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or your frontend URL
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Root Route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Database Connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://da804107:mypassword@cluster0.v6oei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
client.connect();

// SignUp Route
app.post('/api/signup', async (req, res, next) => {
    const { username, password } = req.body;
    const newUser = { UserId: null, Username: username, Password: password };
    let error = '';

    try {
        const db = client.db('project');
        newUser.UserId = await db.collection('Users').countDocuments();

        /* Uncomment to check for existing user
        if (await db.collection('Users').findOne({ Username: newUser.Username })) {
            return res.status(400).json({ error: 'User already exists' });
        }
        */

        await db.collection('Users').insertOne(newUser);
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ error });
});

// Login Route
app.post('/api/login', async (req, res, next) => {
    const { login, password } = req.body;
    let error = '';
    let id = -1, fn = '', ln = '';

    try {
        const db = client.db('project');
        const results = await db.collection('Users').find({ Username: login, Password: password }).toArray();

        if (results.length > 0) {
            id = results[0].UserId;
            fn = results[0].FirstName || '';
            ln = results[0].LastName || '';
        } else {
            error = 'Wrong username/password';
        }
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ id, firstName: fn, lastName: ln, error });
});

// Add Card to Study Set
app.post('/api/addcard', async (req, res, next) => {
    const { userId, setName, cardTitle, cardDesc } = req.body;
    const newCard = { SetName: setName, CardTitle: cardTitle, CardDesc: cardDesc, UserId: userId };
    let error = '';

    try {
        const db = client.db('project');
        await db.collection('Flash-Cards').insertOne(newCard);
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ error });
});

// Add Study Set
app.post('/api/addset', async (req, res, next) => {
    const { userId, setName } = req.body;
    const newSet = { SetName: setName, UserId: userId }; // Fixed variable name
    let error = '';

    try {
        const db = client.db('project');
        await db.collection('Study-Sets').insertOne(newSet);
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ error });
});

// Search Study Sets
app.post('/api/searchsets', async (req, res, next) => {
    const { userId, search } = req.body;
    const _search = search.trim();
    let error = '';
    let _ret = [];

    try {
        const db = client.db('project');
        const results = await db.collection('Study-Sets').find({ UserId: userId, SetName: { $regex: _search + '.*' } }).toArray();

        for (let i = 0; i < results.length; i++) {
            _ret.push(results[i].SetName);
        }
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ results: _ret, error });
});

// Search Flash Cards
app.post('/api/searchcards', async (req, res, next) => {
    const { userId, setName } = req.body;
    let error = '';
    let _ret = [];

    try {
        const db = client.db('project');
        const results = await db.collection('Flash-Cards').find({ UserId: userId, SetName: setName }).toArray();

        for (let i = 0; i < results.length; i++) {
            _ret.push(results[i]);
        }
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ results: _ret, error });
});

// Start the Server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
