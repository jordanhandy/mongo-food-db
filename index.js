const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { appendFileSync } = require('fs');
const Product = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/farmStand',{useNewUrlParser: true, useUnifiedTopology:true}).then(() =>{
    console.log("mongo connection open!");
}).catch((err)=>{
    console.log('Could not connect to mongo');
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); // Use this value to force an unsupported API verb on a form

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

app.get('/products/:id/edit',async (req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('products/edit',{product});
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
    res.redirect(`/products/${product._id}`); // Redirect to specific page for created product
})

app.put('/products/:id',async (req,res)=>{
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;
    await product.save().then((res)=>{
        console.log('edit has been saved');
    });
    res.redirect(`/products/${product._id}`);

})
app.delete('/products/:id/delete',async(req,res)=>{
    const foundProduct = await Product.findByIdAndDelete(req.params.id).then((res)=>{
        console.log('deleted');
    }).catch((e)=>{
        console.log('could not delete');
    });
    res.redirect('/products')
})

app.listen(3000,()=>{
    console.log('listening on port 3000');
})