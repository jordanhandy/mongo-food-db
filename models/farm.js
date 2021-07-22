const mongoose = require('mongoose');
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
    }

})
const Farm = mongoose.model("Farm",farmSchema);
module.exports = {
    Farm
};