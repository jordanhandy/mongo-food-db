const mongoose = require('mongoose');
const Product = require("./product");
const farmSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Farm must have a name']
    },
    city: {
        type:String,
    },
    email:{
        type:String,
        required:[true, 'Email is required']
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]

})
// This is a query middleware, so must come 'post' the query
// so we know the data we're working with
farmSchema.post('findOneAndDelete',async function(farm){
    if(farm.products.length){
        // Delete all products whose ID is in the products array
        Product.deleteMany({_id:{$in: farm.products}});
    }
})
const Farm = mongoose.model("Farm",farmSchema);
module.exports = Farm;