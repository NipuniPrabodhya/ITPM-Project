const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const { sort, category, search } = req.query;
        let queryObj = {};

        if (category && category !== 'All') {
            queryObj.category = category;
        }

        if (search) {
            queryObj.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let query = Product.find(queryObj);

        if (sort) {
            if (sort === 'price_asc') query = query.sort({ price: 1 });
            else if (sort === 'price_desc') query = query.sort({ price: -1 });
            else if (sort === 'views_desc') query = query.sort({ views: -1 });
            else if (sort === 'newest') query = query.sort({ createdAt: -1 });
        }

        const products = await query;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.views += 1;
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, price, details, image, category, stock } = req.body;
        const product = new Product({
            title,
            description,
            price,
            details,
            image,
            category: category || 'Other',
            stock: Number(stock) || 1,
            owner: req.user.username // Associate with logged-in user
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if owner or admin
            if (product.owner !== req.user.username && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to edit this product' });
            }

            product.title = req.body.title || product.title;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.details = req.body.details || product.details;
            product.image = req.body.image || product.image;
            product.category = req.body.category || product.category;
            product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.owner !== req.user.username && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle Cart Status
// @route   PUT /api/products/:id/cart
router.put('/:id/cart', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            if (product.stock <= 0) {
                return res.status(400).json({ message: 'Product is out of stock' });
            }
            if (product.isPending) {
                return res.status(400).json({ message: 'Product is currently being purchased and is pending verification' });
            }
            if (product.inCart && product.cartOwner !== req.user.username) {
                return res.status(400).json({ message: 'Product already in another person\'s cart' });
            }
            product.inCart = !product.inCart;
            product.cartOwner = product.inCart ? req.user.username : null;
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Finalize Checkout
// @route   POST /api/products/checkout
router.post('/checkout', protect, async (req, res) => {
    try {
        const { productIds } = req.body;
        const products = await Product.find({ _id: { $in: productIds } });

        for (let product of products) {
            if (product.stock > 0) {
                product.stock -= 1;
                if (product.stock === 0) {
                    product.sold = true;
                }
                product.inCart = false;
                product.cartOwner = null;
                product.buyer = req.user.username;
                product.purchaseDate = new Date().toLocaleDateString();
                await product.save();
            }
        }

        res.json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
