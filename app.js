var express = require("express"),
  app = express(),
  redis = require("redis"),
  client = redis.createClient(),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser');

// Middleware Setup
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(methodOverride('_method'));

// If you want to use css/js/imgs 
  // app.use(express.static(_dirname + '/public'));

  //root route

  app.get("/", function(req,res){
    client.zrange("students", 0, -1,function(err, students){
    res.render("index", {students:students});
    });
  });

  app.get("/edit/:student", function(req,res){
    var student = req.params.student;
    var year = client.zscore("students", "George Navas");
    console.log(year);
    res.render("edit",{student:student, year:year});
  }); 

  app.post("/create", function(req, res){
    console.log(req.body);
    client.zadd("students", req.body.yob, req.body.name);
    res.redirect('/');
  });

  app.put("/edit/:student", function(req,res){
    client.set(req.params.student,req.body.name);
    res.redirect('/');
  });

  app.delete("/remove/students", function(req,res){
    client.zremrangebyrank("students",0, -1, function(err, reply){
      res.redirect('/');
    });
  });

  app.delete("/remove/:student", function(req,res){
    client.zrem("students",1,req.params.student, function(err, reply){
      res.redirect('/');
    });
  });

// kick off server
  app.listen(3000, function(){
    console.log("kicked off server on port 3000");
  });