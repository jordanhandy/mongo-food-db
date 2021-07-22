const mongoose = require('mongoose');
const farmSchema = new mongoose.Schema({

})
const Farm = mongoose.model("Farm",farmSchema);
module.exports = {
    Farm
};