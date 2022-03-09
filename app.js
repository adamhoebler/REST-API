//Required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Create new app
const app = express();

//Set ejs as templating engine
app.set('view engine', 'ejs');

//Use body parser to parse requests
app.use(bodyParser.urlencoded({
  extended:true
}));

//Use public to store static files
app.use(express.static("public"));

//Setup mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB");

//Create schema for articles
const articleSchema={
  title: String,
  content: String
};

//Create model
const Article = mongoose.model("Article", articleSchema);

//For diff routes using express targeting all articles
app.route("/articles")
  .get(function(req,res){
    //Read from database
    Article.find(function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  })
  .post(function(req,res){
    //Grab from HTML and save into new article
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    //Save article
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added new article")
      }else{
        res.sent(err);
      }
    });
  })
  .delete(function(req,res){
    //Delete all
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all articles")
      }else{
        res.send(err);
      }
    });
  });

//Requests targeting specific articles

app.route("/articles/:articleTitle")
  //GET request
  .get(function(req,res){
    Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No articles matching title found");
      }
    });
  })
  //PUT request to update specific article
  .put(function(req,res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err){
        if(!err){
          res.send("Successfully updated article")
        }else{
          res.send(err);
        }
      }
    );
  })
  //PATCH request
  .patch(function(req,res){
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article");
        }else{
          res.send(err);
        }
      }
    );
  })
  //DELETE request
  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully deleted article");
        }else{
          res.send(err);
        }
      }
    );
  });


//Listen on port 3000
app.listen(3000,function(){
  console.log("Server started on port 3000");
});
