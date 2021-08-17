const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); //body 사용
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.i0oe3.mongodb.net/Todoapp?retryWrites=true&w=majority',function(err,client){
    if(err) return console.log(err);
    app.listen(8080,function(){
        console.log('listening on 8080')
    });
    db = client.db('TodoApp')
})



app.get('/',function(req,res){
    res.render('index.ejs')
});


app.get('/pet',function(req,res){
    res.send('pet용품점입니다~~~~.')
});

app.get('/write',function(req,res){
    res.render('write.ejs')
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

app.delete('/delete',function(req,res){
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body,function(에러,결과){
        console.log('삭제완료')
    })
    res.send('삭제완료')
})

app.get('/detail/:id',function(req,res){
    db.collection('post').findOne({_id: parseInt(req.params.id)},function(에러,결과){
        if(에러){return res.send('에러')}
        res.render('detail.ejs', {data: 결과})
    })
})

app.get('/edit/:id', function(req,res){
    db.collection('post').findOne({_id: parseInt(req.params.id)},function(에러,결과){
        res.render('edit.ejs', {post: 결과})
        console.log(결과)
    })
})

app.put('/edit',function(req,res){
    db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set: {제목: req.body.title, 내용: req.body.content}},function(에러,결과){
        console.log('수정완료')
        res.redirect('/list')
    });
})

app.get('/login',function(req,res){
    res.render('login.ejs')
})

app.get('/fail',function(req,res){
    res.render('fail.ejs')
})

app.post('/login',  passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    res.redirect('/')
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  app.get('/mypage',로그인했니, function(req,res){
      console.log(req.user)
      res.render('mypage.ejs', { 사용자: req.user})
  })

function 로그인했니(res, req, next) {
  if (res.user) {
    next()
  } else {
    req.send('로그인안하셨는데요?')
  }
}

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });
  
  passport.deserializeUser(function (아이디, done) {
      db.collection('login').findOne({id: 아이디},function(에러,결과){
        done(null, 결과)
      })
    
  }); 