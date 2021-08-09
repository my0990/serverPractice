const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.i0oe3.mongodb.net/Todoapp?retryWrites=true&w=majority',function(err,client){
    if(err) return console.log(err);
    app.listen(8080,function(){
        console.log('listening on 8080')
    });
})

app.listen(8080,function(){
    console.log('listening on 8080')
});

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
});


app.get('/pet',function(req,res){
    res.send('pet용품점입니다~~~~.')
});

app.get('/write',function(req,res){
    res.sendFile(__dirname + '/write.html')
});

app.get('/test',function(req,res){
    res.sendFile(__dirname + '/test.html')
});

app.use(express.static('public'));

app.post('/add', function(req,res){
    console.log(req.body);
    res.send('전송완료')
});