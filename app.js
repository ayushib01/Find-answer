const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());    //takes the json data that comes along with a request and it passes
 //it to a javascript object so that we can use it inside code and attaches that object with that data for us to the request objects that we can access it in our request
app.use(cookieParser());
//register view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://ayu:test1234@cluster0.xvefu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000,(req,res)=>{
    console.log('Connected to db');
  }))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser); //checking to every route
app.get('/', (req, res) => res.render('home'));
app.get('/Welcome', requireAuth,(req, res) => res.render('Welcome'));
app.use(authRoutes);




