const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    owner: {
        type: String, // Storing username for simplicity with existing frontend logic
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    sold: {
        type: Boolean,
        default: false
    },
    inCart: {
        type: Boolean,
        default: false
    },
    cartOwner: {
        type: String,
        default: null
    },
    details: {
        type: String,
        default: ''
    },
    image: {
        type: String, // Base64 string as requested
        default: ''
    },
    category: {
        type: String,
        default: 'Other',
        enum: ['Electronics', 'Education', 'Fashion', 'Home & Living', 'Other']
    },
    buyer: {
        type: String,
        default: null
    },
    purchaseDate: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Sync stock with sold status
productSchema.pre('save', async function() {
    if (this.sold) {
        this.stock = 0;
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
