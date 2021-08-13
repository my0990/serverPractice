const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;


var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.i0oe3.mongodb.net/Todoapp?retryWrites=true&w=majority',function(err,client){
    if(err) return console.log(err);
    app.listen(8080,function(){
        console.log('listening on 8080')
    });
    db = client.db('TodoApp')
})



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

app.use(express.static('public')); //정적파일 제공하기 *css파일 사용할때

app.post('/add', function(req,res){
    console.log(req.body);
    res.send('전송완료');
    db.collection('counter').findOne({name: "counter"}, function(에러,결과){  //글번호
        var 총게시물갯수 = 결과.totalpost;
        db.collection('post').insertOne({_id: 총게시물갯수 + 1,제목: req.body.title, 내용: req.body.content}, function(){ //글번호 적용
            db.collection('counter').updateOne({name: 'counter'},{$inc:{ totalpost: 1}}, function(에러,결과){  //글번호 업데이트
                if(에러) {return console.log(에러)};
                console.log('저장완료');
            })
            
        })
    })
    
});

app.get('/list', function(req,res){
    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과)
        res.render('list.ejs',{posts: 결과})
    })
})