const express = require('express');
const app = express();
const mysql = require('mysql');
const Post = require('./Post');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use('/', express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'almas',
    password: 'password',
    database: 'miniblog'
});

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


app.get('/blogposts', async (req, res) => {
    const query = `select * from blogpost order by id desc`;
    const posts = await Post.find()
    connection.query(query,
        (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            return res.send({
                mysql: rows,
                mongo: posts
            });
        });
})




app.post('/blogposts', (req, res) => {
    console.log(req.body.title)
    if (!(req.body.title || req.body.content)) {
        return res.send({
            error: 'Titel and content required'
        });
    }

    const query = `insert into blogpost (
            createdAt, title, content
                )
            values (
                now(),?,?
                )`;

    connection.query(
        query, [req.body.title, req.body.content],
        (err, result) => {
            if (err) {
                // falls ein Fehler definiert wurde, dann schauen wir mal
                // was schiefgelaufen ist evtl. falsche mysql syntax
                console.log('Error: ' + err);
                return;
            }
            return res.send({
                error: 0,
                result: result.id
            });
        });
})


app.post('/mongoblogposts', async (req, res) => {
    //TODO save to mongodb
    console.log(req.body);
    const createdPost = await Post.create(req.body);
    console.log("1", createdPost)
    res.json(post)
})




app.listen((3000), () => console.log('hey'));