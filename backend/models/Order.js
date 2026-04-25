const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    buyer: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    slipImage: {
        type: String, // Base64
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'rejected'],
        default: 'processing'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
