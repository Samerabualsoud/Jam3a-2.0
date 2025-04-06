// MongoDB Atlas Production Setup Script
const mongoose = require('mongoose');
const config = require('../config/config');

// Sample data for initial database setup
const initialData = {
  categories: [
    { name: 'Electronics', description: 'Electronic devices and gadgets', image: 'electronics.jpg', featured: true },
    { name: 'Home Appliances', description: 'Appliances for your home', image: 'appliances.jpg', featured: true },
    { name: 'Smartphones', description: 'Latest smartphones and accessories', image: 'smartphones.jpg', featured: true },
    { name: 'Computers', description: 'Laptops, desktops and accessories', image: 'computers.jpg', featured: true }
  ],
  products: [
    {
      name: 'iPhone 16 Pro',
      description: 'Latest iPhone with advanced features',
      price: 3999,
      category: 'Smartphones',
      stock: 50,
      images: ['iphone16.jpg'],
      featured: true,
      specifications: {
        display: '6.1-inch Super Retina XDR',
        processor: 'A18 Bionic',
        camera: 'Triple 48MP camera system',
        battery: 'Up to 23 hours video playback'
      }
    },
    {
      name: 'Samsung 55" QLED 4K Smart TV',
      description: 'Premium QLED TV with stunning picture quality',
      price: 3999,
      category: 'Electronics',
      stock: 30,
      images: ['samsungtv.jpg'],
      featured: true,
      specifications: {
        display: '55-inch QLED 4K',
        processor: 'Quantum Processor 4K',
        sound: 'Object Tracking Sound',
        connectivity: 'Wi-Fi, Bluetooth, HDMI'
      }
    },
    {
      name: 'Apple AirPods Pro (2nd Generation)',
      description: 'Wireless earbuds with active noise cancellation',
      price: 999,
      category: 'Electronics',
      stock: 100,
      images: ['airpods.jpg'],
      featured: true,
      specifications: {
        audio: 'Active Noise Cancellation',
        battery: 'Up to 6 hours of listening time',
        connectivity: 'Bluetooth 5.0',
        features: 'Spatial Audio, Adaptive EQ'
      }
    }
  ],
  deals: [
    {
      title: 'iPhone 16 Pro Group Deal',
      description: 'Join this group to get the latest iPhone at a discount',
      product: 'iPhone 16 Pro',
      originalPrice: 3999,
      groupPrice: 3499,
      discount: 12,
      requiredParticipants: 5,
      currentParticipants: 3,
      status: 'active',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      featured: true
    },
    {
      title: 'Samsung TV Group Deal',
      description: 'Get this premium TV at a discounted price',
      product: 'Samsung 55" QLED 4K Smart TV',
      originalPrice: 3999,
      groupPrice: 2899,
      discount: 27,
      requiredParticipants: 5,
      currentParticipants: 3,
      status: 'active',
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      featured: true
    },
    {
      title: 'AirPods Pro Deal',
      description: 'Premium wireless earbuds at a group discount',
      product: 'Apple AirPods Pro (2nd Generation)',
      originalPrice: 999,
      groupPrice: 799,
      discount: 20,
      requiredParticipants: 5,
      currentParticipants: 4,
      status: 'active',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      featured: true
    }
  ]
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('Connected to MongoDB Atlas');

    // Import models
    const Category = require('../models/Category');
    const Product = require('../models/Product');
    const JamDeal = require('../models/JamDeal');
    const User = require('../models/User');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@jam3a.me' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@jam3a.me',
        password: 'Admin123!',
        roles: ['admin', 'user']
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Create test user
    const testUserExists = await User.findOne({ email: 'test@jam3a.me' });
    if (!testUserExists) {
      const testUser = new User({
        name: 'Test User',
        email: 'test@jam3a.me',
        password: 'Test123!',
        roles: ['user']
      });
      await testUser.save();
      console.log('Test user created');
    }

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await JamDeal.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const categories = await Category.insertMany(initialData.categories);
    console.log(`${categories.length} categories inserted`);

    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Insert products with correct category IDs
    const productsWithCategories = initialData.products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));
    const products = await Product.insertMany(productsWithCategories);
    console.log(`${products.length} products inserted`);

    // Map product names to IDs
    const productMap = {};
    products.forEach(product => {
      productMap[product.name] = product._id;
    });

    // Insert deals with correct product IDs
    const dealsWithProducts = initialData.deals.map(deal => ({
      ...deal,
      product: productMap[deal.product]
    }));
    const deals = await JamDeal.insertMany(dealsWithProducts);
    console.log(`${deals.length} deals inserted`);

    console.log('Database seeded successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    
    return {
      categories: categories.length,
      products: products.length,
      deals: deals.length,
      users: 2 // Admin and test user
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(result => {
      console.log('Seeding completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
