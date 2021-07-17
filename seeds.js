const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand',{useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    console.log("mongo connection open!");
}).catch((err)=>{
    console.log('Could not connect to mongo');
    console.log(err);
});

const p = new Product({name: "Peas", price:"5.99",category:"vegetable"});
p.save().then(()=>{
    console.log('saved!');
}).catch((e)=>{
    console.log("error");
    console.log(e);
})

const seedProducts = [
    {name: "Squash", price:"15.99",category:"vegetable"},
    {name: "Mangoes", price:"5.99",category:"fruit"},
    {name: "Milk", price:"6.99",category:"dairy"},
    {name: "Tomato", price:"7.99",category:"fruit"}
];

Product.insertMany(seedProducts).then(res=>{
    console.log(res);
}).catch((e)=>{
    console.log(e);
});
