const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-TypeError, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.listen(5000); //start Node + Express server on port 5000

//Database
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://da804107:<db_password>@proj-2.ghujw.mongodb.net/?retryWrites=true&w=majority&appName=PROJ-2';
const client = new MongoClient(url);
client.connect();
