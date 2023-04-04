const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        // viết thường khi lưu vào fb
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    quality: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    image: {
        type: Array,
    },
    color: {
        type: String,
        enum: ['Black', 'White', 'Red', 'Blue']
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            comment: { type: String },
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Product', productSchema);