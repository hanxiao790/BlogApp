var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    ejs = require('ejs'),
    app = express(),
    path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
mongoose.connect('mongodb://localhost/restful_blog_app', {useMongoClient: true});
// ========================================================


// ==== Create blog schema ====
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);


// ==== RESTful Routes ====
app.get('/', function(req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            // console.log(blogs);
            res.render('index', {blogs: blogs});
        }
    });
});

app.post('/blogs', function(req, res) {
    // create blog
    Blog.create(req.body.blog, function(err, result) {
        if(err) {
            console.log('somethings wrong: (Blog.create)');
            console.log(err);
        } else {
            // redirect to /index
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/new', function(req, res) {
    res.render('new');
});

app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: blog});
        }
    });
});

// edit page
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, result) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: result});
        }
    })
});


// UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, result) {
        if(err) {
            console.log('ERROR(Blog.findByIdAndUpdate): ' + err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, result) {
        if(err) {
            console.log('ERROR(Blog.findByIdAndRemove): ' + err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

// ========= Listen config =========
app.listen(3000, function() {
    console.log('Server is running');
});
