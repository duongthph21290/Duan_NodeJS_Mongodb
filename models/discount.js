const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    // Hạn sử dụng
    expiry: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Discount', discountSchema);