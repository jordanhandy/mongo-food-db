const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { appendFileSync } = require('fs');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand',{useNewUrlParser: true, useUnifiedTopology:true}).then(() =>{
    console.log("mongo connection open!");
}).catch((err)=>{
    console.log('Could not connect to mongo');
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))

app.get('/products', async (req,res)=>{
    const products = await Product.find({});
    res.render('products/index',{
        products:products
    });
})
app.get('/products/new',(req,res)=>{
    res.render('products/new');
})
app.get('/products/:id',async(req,res)=>{
    const product = await Product.findById(req.params.id); // find by id, given id params
    console.log(product);
    res.render('products/details',{
        product:product
    });
})


app.post('/products',async (req,res)=>{
    product = new Product({
        name: req.body.name,
        price:req.body.price,
        category:req.body.category
    });
    await product.save().then((res)=>{
        console.log('saved');
    })
    res.redirect('/products');
})

app.listen(3000,()=>{
    console.log('listening on port 3000');
})