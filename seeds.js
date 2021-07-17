const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand',{useNewUrlParser: true}).then(() =>{
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
// const q = new Product({name: "Squash", price:"15.99",category:"vegetable"});
// const r = new Product({name: "Mangoes", price:"5.99",category:"fruit"});
// const s = new Product({name: "Milk", price:"6.99",category:"dairy"});
// const t = new Product({name: "Tomato", price:"7.99",category:"fruit"});