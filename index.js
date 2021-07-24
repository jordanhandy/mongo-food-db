const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const { appendFileSync } = require("fs");
const Product = require("./models/product");
const Farm = require("./models/farm");
const methodOverride = require("method-override"); // for overriding POST from forms for other API verbs

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo connection open!");
  })
  .catch((err) => {
    console.log("Could not connect to mongo");
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Use this value to force an unsupported API verb on a form
const sessionOptions = {
  secret:'thisismysecret',
resave: false,
saveUninitialized:false
}
app.use(session(sessionOptions));
app.use(flash());


app.get("/",(req,res)=>{
  res.render("index");
})

// FARM ROUTES

app.get("/farms",async(req,res)=>{
  const farms = await Farm.find({});
  res.render("farms/index",{
    farms:farms
  });
})

app.get("/farms/new",(req,res)=>{
  res.render("farms/new");
})

app.get("/farms/:id/products/new",(req,res)=>{
  const { id } = req.params;
  res.render('products/new',{id});
})

app.get("/farms/:id",async(req,res)=>{
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/details",{ 
    farm:farm 
  })
})

app.post("/farms",async(req,res)=>{
  const farm = new Farm({
    name:req.body.name,
    city:req.body.city,
    email:req.body.email
  });
  await farm.save();
  res.redirect(`/farms/${farm._id}`);
})

app.post("/farms/:id/products",async(req,res)=>{
  const farm = await Farm.findById(req.params.id).populate();
  const product = await new Product({
    name:req.body.name,
    price:req.body.price,
    category:req.body.category
  });
  farm.products.push(product);
  product.farm = farm;
  await product.save();
  await farm.save();
  res.redirect(`/farms/${req.params.id}`);
})

app.delete("/farms/:id/delete",async(req,res)=>{
  const farm = await Farm.findById(req.params.id).populate("products");
  for (const product of farm.products) {
    const delProduct = await Product.findByIdAndDelete(product._id);
    console.log("Deleted product:",delProduct);
  }
  await Farm.deleteOne({_id: req.params.id});
  console.log("Deleted farm:",farm);
  res.redirect("/farms");
})

// PRODUCT ROUTES

// Filter based on query string or not, which 
// products to include
app.get("/products", async (req, res) => {
  const category = req.query.category;
  if (!category) {
    const products = await Product.find({});
    res.render("products/index", {
      products: products,
    });
  } else {
    const products = await Product.find({ category: category });
    res.render("products/index", {
      products: products,
    });
  }
});
app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.get("/farms/new",(req,res)=>{
  res.render("farms/new");
})

app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("farm"); // find by id, given id params
  console.log(product);
  res.render("products/details", {
    product: product,
  });
});

// This is the page to get the form itself and place in the fields, the
// current values as stored in the db
app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
});
app.post("/products", async (req, res) => {
  product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  });
  await product.save().then((res) => {
    console.log("saved");
  });
  res.redirect(`/products/${product._id}`); // Redirect to specific page for created product
});

// Find by ID and update each of the params before saving back to db
app.put("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.name = req.body.name;
  product.price = req.body.price;
  product.category = req.body.category;
  await product.save().then((res) => {
    console.log("edit has been saved");
  });
  res.redirect(`/products/${product._id}`);
});
app.delete("/products/:id/delete", async (req, res) => {
  const foundProduct = await Product.findByIdAndDelete(req.params.id)
    .then((res) => {
      console.log("deleted");
    })
    .catch((e) => {
      console.log("could not delete");
    });
  res.redirect("/products");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
