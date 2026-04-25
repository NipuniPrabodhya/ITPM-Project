const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create new order (Checkout with bank slip)
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const { productIds, slipImage } = req.body;

        if (!productIds || productIds.length === 0) {
            return res.status(400).json({ message: 'No products selected' });
        }

        if (!slipImage) {
            return res.status(400).json({ message: 'Bank slip image is required' });
        }

        const products = await Product.find({ _id: { $in: productIds } });
        
        // Group products by seller
        const sellersMap = {};
        for (let product of products) {
            if (product.sold) {
                return res.status(400).json({ message: `Product ${product.title} is already sold` });
            }
            if (!sellersMap[product.owner]) {
                sellersMap[product.owner] = [];
            }
            sellersMap[product.owner].push(product);
        }

        const orders = [];
        for (let sellerUsername in sellersMap) {
            const sellerProducts = sellersMap[sellerUsername];
            const totalAmount = sellerProducts.reduce((sum, p) => sum + p.price, 0);

            const order = new Order({
                buyer: req.user.username,
                seller: sellerUsername,
                products: sellerProducts.map(p => ({
                    productId: p._id,
                    title: p.title,
                    price: p.price
                })),
                totalAmount,
                slipImage,
                status: 'processing'
            });

            const savedOrder = await order.save();
            orders.push(savedOrder);

            // Mark products as pending
            for (let p of sellerProducts) {
                p.isPending = true;
                p.inCart = false;
                p.cartOwner = null;
                await p.save();
            }
        }

        res.status(201).json({ message: 'Orders placed successfully', orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get orders for seller
// @route   GET /api/orders/seller
router.get('/seller', protect, async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.username }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get orders for buyer
// @route   GET /api/orders/buyer
router.get('/buyer', protect, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.username }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify/Complete order
// @route   PUT /api/orders/:id/verify
router.put('/:id/verify', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.seller !== req.user.username && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to verify this order' });
        }

        if (order.status !== 'processing') {
            return res.status(400).json({ message: 'Order is already ' + order.status });
        }

        order.status = 'completed';
        await order.save();

        // Update products: decrement stock, mark as sold if stock 0
        for (let item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock -= 1;
                product.isPending = false;
                if (product.stock <= 0) {
                    product.sold = true;
                }
                product.buyer = order.buyer;
                product.purchaseDate = new Date().toLocaleDateString();
                await product.save();
            }
        }

        res.json({ message: 'Order verified and completed', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
