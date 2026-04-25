const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Existing data cleared.');

        // Seed Users
        const salt = await bcrypt.genSalt(10);
        const pass1234 = await bcrypt.hash('1234', salt);

        const users = [
            {
                username: 'admin',
                email: 'admin@my.sliit.lk',
                password: pass1234,
                phone: '0712345678',
                role: 'admin',
                active: true,
                profileImg: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
            },
            {
                username: 'student1',
                email: 'student1@my.sliit.lk',
                password: pass1234,
                phone: '0771234567',
                role: 'student',
                active: true,
                profileImg: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png'
            },
            {
                username: 'student2',
                email: 'student2@my.sliit.lk',
                password: pass1234,
                phone: '0781234567',
                role: 'student',
                active: true,
                profileImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2'
            },
            {
                username: 'student3',
                email: 'student3@my.sliit.lk',
                password: pass1234,
                phone: '0751234567',
                role: 'student',
                active: true,
                profileImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3'
            },
            {
                username: 'student4',
                email: 'student4@my.sliit.lk',
                password: pass1234,
                phone: '0701234567',
                role: 'student',
                active: true,
                profileImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4'
            },
            {
                username: 'tester',
                email: 'tester@my.sliit.lk',
                password: pass1234,
                phone: '0761234567',
                role: 'student',
                active: true,
                profileImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tester'
            },
            {
                username: 'nipuni',
                email: 'it22280374@my.sliit.lk',
                password: await bcrypt.hash('password123', salt),
                phone: '0754567890',
                role: 'student',
                active: true,
                profileImg: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} Users seeded.`);

        // Seed Products
        const products = [
            {
                title: 'SLIIT Official Hoodie',
                description: 'Limited edition navy blue hoodie with university crest. Size: XL',
                price: 4500,
                owner: 'student1',
                details: 'Used for one semester. Great condition. Cotton blend.',
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
                views: 15,
                sold: false,
                category: 'Fashion'
            },
            {
                title: 'Organic Chemistry II Textbook',
                description: 'Essential textbook for second-year chemistry students. 10th Edition.',
                price: 2500,
                owner: 'nipuni',
                details: 'Minimal highlighting. Includes study guide.',
                image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
                views: 28,
                sold: false,
                category: 'Education'
            },
            {
                title: 'Casio Scientific Calculator',
                description: 'FX-991ES Plus II. Approved for all university exams.',
                price: 6800,
                owner: 'student1',
                details: 'Almost brand new. Battery included.',
                image: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&q=80&w=400',
                views: 45,
                sold: false,
                category: 'Education'
            },
            {
                title: 'MacBook Air M1 (2020)',
                description: '8GB RAM, 256GB SSD. Space Gray. Perfect for IT students.',
                price: 215000,
                owner: 'admin',
                details: 'Battery cycle count: 120. Comes with box and original charger.',
                image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
                views: 120,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'Wireless Optical Mouse',
                description: '2.4GHz wireless connection. Compact and comfortable design.',
                price: 1800,
                owner: 'student2',
                details: 'Brand new, never used. Still in packaging.',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
                views: 12,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'University Backpack',
                description: 'Water-resistant material with multiple compartments for laptops and books.',
                price: 3500,
                owner: 'student3',
                details: 'Used for 1 year. Small wear on the straps but overall good.',
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
                views: 22,
                sold: false,
                category: 'Fashion'
            },
            {
                title: 'LED Desk Lamp',
                description: 'Adjustable brightness and color temperature. Eye-protection mode.',
                price: 2200,
                owner: 'student4',
                details: 'Great for late-night studying. Energy efficient.',
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
                views: 18,
                sold: false,
                category: 'Education'
            },
            {
                title: 'Sony Noise Cancelling Headphones',
                description: 'WH-1000XM4. Industry-leading noise cancellation. 30 hours battery life.',
                price: 45000,
                owner: 'tester',
                details: 'Excellent condition. Includes case and cables.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
                views: 55,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'iPhone 12 - 128GB',
                description: 'Used iPhone 12, Blue color. Battery health 85%. No scratches.',
                price: 95000,
                owner: 'student2',
                details: 'Comes with original box and cable. Screen protector already applied.',
                image: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?auto=format&fit=crop&q=80&w=400',
                views: 82,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'Samsung Galaxy S21',
                description: 'Phantom Gray, 256GB storage. Used for 1 year.',
                price: 85000,
                owner: 'student3',
                details: 'Minor wear on the frame. Camera is perfect. Includes fast charger.',
                image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400',
                views: 40,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'Mountain Bike - 21 Speed',
                description: 'Durable mountain bike, perfect for campus hills.',
                price: 32000,
                owner: 'student4',
                details: 'Recently serviced. New brake pads. Large frame size.',
                image: 'https://images.unsplash.com/photo-1532298229144-0ee0c57512c7?auto=format&fit=crop&q=80&w=400',
                views: 110,
                sold: false,
                category: 'Other'
            },
            {
                title: 'Classic City Commuter Bike',
                description: 'Elegant white city bike with basket and rear rack.',
                price: 28000,
                owner: 'nipuni',
                details: 'Vintage style. Very comfortable for short rides. Includes lock.',
                image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
                views: 65,
                sold: false,
                category: 'Other'
            },
            {
                title: 'Data Structures and Algorithms in Java',
                description: 'Comprehensive guide for CS students. 6th Edition.',
                price: 3500,
                owner: 'admin',
                details: 'No markings on pages. Very helpful for coding interviews.',
                image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400',
                views: 95,
                sold: false,
                category: 'Education'
            },
            {
                title: 'Introduction to Algorithms (CLRS)',
                description: 'The definitive algorithms textbook. 3rd Edition.',
                price: 5500,
                owner: 'student1',
                details: 'Hardcover. Slightly worn but complete. Essential for computer science.',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
                views: 150,
                sold: false,
                category: 'Education'
            },
            {
                title: 'Asus ROG Strix Gaming Laptop',
                description: 'RTX 3060, 16GB RAM, 512GB SSD. RGB keyboard.',
                price: 245000,
                owner: 'student2',
                details: 'Only 6 months old. Plays all modern games at ultra settings.',
                image: 'https://images.unsplash.com/photo-1544117518-33957289df3d?auto=format&fit=crop&q=80&w=400',
                views: 88,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'Acoustic Guitar - Yamaha',
                description: 'Perfect for beginners. Includes a gig bag.',
                price: 15000,
                owner: 'student3',
                details: 'Good sound quality. A few minor scratches on the back.',
                image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=400',
                views: 42,
                sold: false,
                category: 'Other'
            },
            {
                title: 'Nespresso Coffee Maker',
                description: 'Mini espresso machine. Fast heat up.',
                price: 12500,
                owner: 'student4',
                details: 'Used for one semester. Great for coffee lovers.',
                image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=400',
                views: 31,
                sold: false,
                category: 'Home & Living'
            },
            {
                title: 'Ergonomic Study Chair',
                description: 'Breathable mesh back with lumbar support.',
                price: 8500,
                owner: 'tester',
                details: 'Very comfortable for long study sessions.',
                image: 'https://images.unsplash.com/photo-1505797149-43b007664976?auto=format&fit=crop&q=80&w=400',
                views: 25,
                sold: false,
                category: 'Home & Living'
            },
            {
                title: 'Logitech C920 HD Pro Webcam',
                description: 'Full HD 1080p video calling with stereo audio.',
                price: 9500,
                owner: 'nipuni',
                details: 'Used for online classes. Crystal clear quality.',
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
                views: 19,
                sold: false,
                category: 'Electronics'
            },
            {
                title: 'Fundamentals of Physics',
                description: 'Halliday, Resnick, Walker. 11th Edition.',
                price: 4200,
                owner: 'student1',
                details: 'No highlights. Includes E-book code.',
                image: 'https://images.unsplash.com/photo-1632583306532-68078696c141?auto=format&fit=crop&q=80&w=400',
                views: 14,
                sold: false,
                category: 'Education'
            }
        ];

        await Product.insertMany(products);
        console.log(`${products.length} Products seeded.`);

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
