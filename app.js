const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./models/model.js')
require("./models/posts.js")
const router = require('./routes/auth.js');
const dotenv = require('dotenv');
const postRouter = require("./routes/createPost.js")
const UserRouter = require("./routes/user.js") //this is file to check other profile
const path = require('path')

dotenv.config()

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// const origin = "http://localhost:3000";
const port = process.env.port || 5000;

// app.use(cors());
app.use(cors({ credentials:true}));

mongoose.connect(`mongodb+srv://abhi:${process.env.DB_PASSWORD}@cluster0.isarath.mongodb.net/?retryWrites=true&w=majority`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true   
  }) 
  .then(() => {
    console.log("Successfully connect to MongoDB");
  })
  .catch(err => {
    console.error("Connection error", err.message);
  });

  console.log(path.join(__dirname));
  
  app.use('/',router);
  app.use(UserRouter);
  app.use(postRouter);
  
  // Serving the frontent
  app.use(express.static(path.join(__dirname, 'client', 'build')))
  // app.use(express.static(path.join(__dirname, "./client/build")))
  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    // res.sendFile(
    //   path.join(__dirname, "./client/build/index.html"),
    //   function(err){
    //     res.status(500).send(err)
    //   }
    // )
  })
app.listen(port, ()=>{
    console.log(`Server is running on port - ${port}`);
})