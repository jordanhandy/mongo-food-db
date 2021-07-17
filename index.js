const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { appendFileSync } = require('fs');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand',{useNewUrlParser: true}).then(() =>{
    console.log("mongo connection open!");
}).catch((err)=>{
    console.log('Could not connect to mongo');
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/dog',(req,res)=>{
    res.send('woof!');
})
app.listen(3000,()=>{
    console.log('listening on port 3000');
})