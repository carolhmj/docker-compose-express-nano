const express = require('express');
const bodyParser = require('body-parser');
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const nano = require('nano')(`http://${USER}:${PASSWORD}@${HOST}:5984`);
const app = express();
const port = 8000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    const db = nano.use('mydb');
    const answer = ['The list of documents in the db is...'];
    const docs = await db.list({include_docs: true});
    console.log(docs.rows);
    answer.push(docs.rows.map(row => JSON.stringify(row.doc)));
    res.send(answer.join('\n'));
});

app.post('/', async (req, res) => {
    const db = nano.use('mydb');
    console.log(req.body);
    await db.insert(req.body);
    res.send('received request');
});

app.listen(port, async () => {
    console.log('Initializing...');
    try {
        await nano.db.get('mydb');
    } catch (err) {
        await nano.db.create('mydb');
    }
    console.log('Initialized db!');
    console.log('Listening at port', port);
});