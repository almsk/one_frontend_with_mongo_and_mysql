const express = require('express');
const app = express();
const mysql = require('mysql');
const Post = require('./Post');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use('/', express.static('public')); // folder name 'public'

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
    let resultmysql=[];
    const query = `select * from blogpost order by id desc`;

    connection.query(query,
        async (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            resultmysql= rows;

            const posts = await Post.find().sort({_id: -1});
            let result = {
                mysql: rows,
                mongo: posts}
            
            return res.json(result);
});
})




app.post('/blogposts', (req, res) => {
    console.log(req.body.title)
    if (!(req.body.title || req.body.content)) {
        return res.send({
            error: 'Titel and content required'
        });
    }
//  if (req.body.database == 'mysql') {
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
    // }
})


app.post('/mongoblogposts', async (req, res) => {
//    if (req.body.database == 'mongo') {
        //TODO save to mongodb
    console.log(req.body);
    const createdPost = await Post.create(req.body);
    console.log("1", createdPost)
    res.json(createdPost)
// }
}) 

//UPDATE
app.put('/:post_id', async (req, res) => {
    console.log(req.params);
    const post = await Post.findById(req.params.post_id)
    await post.update(req.body);
    res.json(post)
  });



app.listen((3000), () => console.log('hey'));




