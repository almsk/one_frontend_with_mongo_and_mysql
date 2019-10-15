const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.json());
app.use('/', express.static('public'));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'almas',
    password: 'password',
    database: 'miniblog'
});

mongoose.connect( process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.get('/blogposts', (req, res) => {
    const query = `select * from blogpost order by id desc`;

    connection.query(query,
        (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            return res.send(rows);
        });
})




app.post('/blogposts', (req, res) => {
    if (!(req.body.title || req.body.content)) {
        return res.send({
            error: 'Titel and content required'
        });
    }

    const query = `insert into blogpost (
                created, title, content
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

});

app.post('/mongoblogposts', async (req, res) => {
    //TODO save to mongodb
      console.log(req.body); 
    const createdPost = await Post.create(req);
  
   

    console.log("1", createdPost)

})()




app.listen(3000);