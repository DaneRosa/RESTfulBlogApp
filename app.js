//GETTING STARTED, DEFAULT SHIT NEEDED

var express     = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
app             = express();
require('dotenv').config({ path: 'variables.env' });

// APP CONFIG
mongoose.connect(process.env.DATABASE); //connecting mongo -> THE NAME OF WHAT WE WILL LOOK FOR IN MONGO
app.set("view engine", "ejs"); //connecting ejs
app.use(express.static("public")); //using express
app.use(bodyParser.urlencoded({extended: true})); //using body-parser
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*


//defining Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {type: Date, default: Date.now} //i.e it should be a date and to check for default date value as of now
});



//MONGOOSE/MODEL CONFIG
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function (req, res){
    res.redirect("/blogs");
        
});

//INDEX ROUTE
app.get("/blogs", function (req, res){
    Blog.find({}, function (err, blogs){ // adding index functionality to retrieve all blogs from database
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); //blogs:blogs -> render index with data (blogs is the data)
        }
    });
});


//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");// all we have to do is render b/c its new
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
   //create blog
   Blog.create(req.body.blog, function (err, newBlog){
       if(err) {
           res.render("new");
       } else {
           //if successful, redirect to index
           res.redirect("/blogs");
       }
   });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
              res.render("edit", {blog: foundBlog}); 
       }
   })
});

// This is being a bitch and returning an error: 
// { CastError: Cast to ObjectId failed for value " 5ac4f042af52292a333570e7" at path "_id" for model "Blog"

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
	// sanitize the input
	// req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
   // redirect somewhere
});

app.listen(3000, function(){
  console.log("++++++++++++++ RSETful blog app is up and running ++++++++++++++");
});


