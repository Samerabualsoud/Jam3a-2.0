// MongoDB data seeding script for Jam3a-2.0
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Category from './models/Category.js';
import Product from './models/Product.js';
import Deal from './models/Deal.js';
import User from './models/User.js';
import AnalyticsConfig from './models/AnalyticsConfig.js';

// Sample categories data
const categories = [
  {
    name: 'Smartphones',
    nameAr: 'الهواتف الذكية',
    description: 'Latest smartphones and mobile devices',
    descriptionAr: 'أحدث الهواتف الذكية والأجهزة المحمولة',
    active: true
  },
  {
    name: 'Laptops',
    nameAr: 'أجهزة الكمبيوتر المحمولة',
    description: 'High-performance laptops and notebooks',
    descriptionAr: 'أجهزة الكمبيوتر المحمولة عالية الأداء',
    active: true
  },
  {
    name: 'Audio',
    nameAr: 'الصوتيات',
    description: 'Headphones, speakers, and audio equipment',
    descriptionAr: 'سماعات الرأس ومكبرات الصوت والمعدات الصوتية',
    active: true
  },
  {
    name: 'Wearables',
    nameAr: 'الأجهزة القابلة للارتداء',
    description: 'Smartwatches, fitness trackers, and wearable tech',
    descriptionAr: 'الساعات الذكية وأجهزة تتبع اللياقة البدنية والتقنيات القابلة للارتداء',
    active: true
  },
  {
    name: 'Home Tech',
    nameAr: 'تقنيات المنزل',
    description: 'Smart home devices and appliances',
    descriptionAr: 'أجهزة المنزل الذكية والأجهزة المنزلية',
    active: true
  }
];

// Sample products data
const generateProducts = (categoryIds) => {
  return [
    {
      name: 'iPhone 16 Pro Max 256GB',
      description: 'The latest iPhone with advanced camera system, A18 Bionic chip, and stunning Super Retina XDR display.',
      category: categoryIds[0], // Smartphones
      price: 4999,
      stock: 50,
      sku: 'IP16PM-256-BLK',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Samsung Galaxy S25 Ultra',
      description: 'Flagship Android smartphone with 200MP camera, 8K video recording, and AI-powered features.',
      category: categoryIds[0], // Smartphones
      price: 4599,
      stock: 45,
      sku: 'SGS25U-512-GRY',
      featured: true,
      imageUrl: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Galaxy Z Fold 6',
      description: 'Foldable smartphone with large internal display and improved durability.',
      category: categoryIds[0], // Smartphones
      price: 6999,
      stock: 30,
      sku: 'GZF6-512-BLK',
      featured: false,
      imageUrl: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Galaxy Z Flip 6',
      description: 'Compact foldable smartphone with stylish design and powerful performance.',
      category: categoryIds[0], // Smartphones
      price: 3999,
      stock: 35,
      sku: 'GZF6-256-PRP',
      featured: false,
      imageUrl: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'MacBook Pro 16" M3 Pro',
      description: 'Professional-grade laptop with M3 Pro chip, stunning display, and all-day battery life.',
      category: categoryIds[1], // Laptops
      price: 9999,
      stock: 25,
      sku: 'MBP16-M3P-SLV',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Dell XPS 15',
      description: 'Premium Windows laptop with InfinityEdge display and powerful performance.',
      category: categoryIds[1], // Laptops
      price: 7999,
      stock: 20,
      sku: 'DXP15-i9-SLV',
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'AirPods Pro 2',
      description: 'Wireless earbuds with active noise cancellation and spatial audio.',
      category: categoryIds[2], // Audio
      price: 999,
      stock: 100,
      sku: 'APP2-WHT',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Premium wireless headphones with industry-leading noise cancellation.',
      category: categoryIds[2], // Audio
      price: 1499,
      stock: 75,
      sku: 'SWH1000XM5-BLK',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced smartwatch with health monitoring and fitness tracking features.',
      category: categoryIds[3], // Wearables
      price: 1799,
      stock: 60,
      sku: 'AWS9-45MM-BLK',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Samsung Galaxy Watch 6',
      description: 'Feature-rich smartwatch with comprehensive health tracking and long battery life.',
      category: categoryIds[3], // Wearables
      price: 1299,
      stock: 55,
      sku: 'SGW6-44MM-SLV',
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Amazon Echo Show 10',
      description: 'Smart display with motion tracking and premium sound quality.',
      category: categoryIds[4], // Home Tech
      price: 999,
      stock: 40,
      sku: 'AES10-BLK',
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'Google Nest Hub Max',
      description: 'Smart home display with built-in Google Assistant and Nest camera.',
      category: categoryIds[4], // Home Tech
      price: 899,
      stock: 35,
      sku: 'GNHM-GRY',
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1558389186-a9d8c8a97f4d?auto=format&fit=crop&w=1600&q=80'
    }
  ];
};

// Sample deals data
const generateDeals = (categoryIds, productIds) => {
  return [
    {
      jam3aId: 'JAM-001',
      title: 'iPhone 16 Pro Max 256GB',
      titleAr: 'آيفون 16 برو ماكس 256 جيجابايت',
      description: 'Join this Jam3a to get the latest iPhone at a discounted price!',
      descriptionAr: 'انضم إلى هذه الجمعة للحصول على أحدث آيفون بسعر مخفض!',
      category: categoryIds[0], // Smartphones
      regularPrice: 4999,
      jam3aPrice: 4199,
      discountPercentage: 16,
      currentParticipants: 4,
      maxParticipants: 5,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      featured: true,
      image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80',
      status: 'active',
      participants: [
        { userId: productIds[0], joinedAt: new Date() }
      ]
    },
    {
      jam3aId: 'JAM-002',
      title: 'Samsung Galaxy S25 Ultra',
      titleAr: 'سامسونج جالاكسي S25 ألترا',
      description: 'Get the flagship Samsung smartphone with amazing camera capabilities!',
      descriptionAr: 'احصل على هاتف سامسونج الرائد مع قدرات كاميرا مذهلة!',
      category: categoryIds[0], // Smartphones
      regularPrice: 4599,
      jam3aPrice: 3899,
      discountPercentage: 15,
      currentParticipants: 3,
      maxParticipants: 6,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      featured: true,
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      status: 'active',
      participants: [
        { userId: productIds[1], joinedAt: new Date() }
      ]
    },
    {
      jam3aId: 'JAM-003',
      title: 'Galaxy Z Fold 6',
      titleAr: 'جالاكسي Z فولد 6',
      description: 'Experience the future of smartphones with this foldable device!',
      descriptionAr: 'جرب مستقبل الهواتف الذكية مع هذا الجهاز القابل للطي!',
      category: categoryIds[0], // Smartphones
      regularPrice: 6999,
      jam3aPrice: 5799,
      discountPercentage: 17,
      currentParticipants: 7,
      maxParticipants: 10,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      featured: false,
      image: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      status: 'active',
      participants: [
        { userId: productIds[2], joinedAt: new Date() }
      ]
    },
    {
      jam3aId: 'JAM-004',
      title: 'MacBook Pro 16" M3 Pro',
      titleAr: 'ماك بوك برو 16 بوصة M3 برو',
      description: 'Professional-grade laptop for creative professionals and developers!',
      descriptionAr: 'كمبيوتر محمول احترافي للمحترفين المبدعين والمطورين!',
      category: categoryIds[1], // Laptops
      regularPrice: 9999,
      jam3aPrice: 8499,
      discountPercentage: 15,
      currentParticipants: 3,
      maxParticipants: 8,
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      featured: true,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=1600&q=80',
      status: 'active',
      participants: [
        { userId: productIds[4], joinedAt: new Date() }
      ]
    },
    {
      jam3aId: 'JAM-005',
      title: 'AirPods Pro 2',
      titleAr: 'إيربودز برو 2',
      description: 'Premium wireless earbuds with active noise cancellation!',
      descriptionAr: 'سماعات أذن لاسلكية متميزة مع ميزة إلغاء الضوضاء النشطة!',
      category: categoryIds[2], // Audio
      regularPrice: 999,
      jam3aPrice: 799,
      discountPercentage: 20,
      currentParticipants: 6,
      maxParticipants: 10,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      featured: false,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1600&q=80',
      status: 'active',
      participants: [
        { userId: productIds[6], joinedAt: new Date() }
      ]
    },
    {
      jam3aId: 'JAM-006',
      title: 'Apple Watch Series 9',
      titleAr: 'ساعة أبل سيريس 9',
      description: 'Stay connected and monitor your health with this advanced smartwatch!',
      descriptionAr: 'ابق على اتصال وراقب صحتك مع هذه الساعة الذكية المتطورة!',
      category: categoryIds[3], // Wearables
      regularPrice: 1799,
      jam3aPrice: 1499,
      discountPercentage: 16.7,
      currentParticipants: 5,
      maxParticipants: 8,
      expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      featured: true,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1600&q=80',
      status: 'active',
      participants: [
        { userId: productIds[8], joinedAt: new Date() }
      ]
    }
  ];
};

// Sample analytics config
const analyticsConfig = {
  trackingId: 'G-EXAMPLE123',
  ipAnonymization: true,
  trackPageViews: true,
  trackEvents: true,
  ecommerceTracking: true,
  active: true
};

// Sample user data
const users = [
  {
    username: 'admin',
    email: 'admin@jam3a.me',
    password: '$2a$10$XFE0rDoJcQ.zH6J.x5qlIO4CvW1gfKtc0QWkUwBnOtLECmcTUdZna', // hashed 'password123'
    name: 'Admin User',
    phone: '+966501234567',
    address: 'Riyadh, Saudi Arabia',
    role: 'admin',
    active: true
  },
  {
    username: 'customer1',
    email: 'customer1@example.com',
    password: '$2a$10$XFE0rDoJcQ.zH6J.x5qlIO4CvW1gfKtc0QWkUwBnOtLECmcTUdZna', // hashed 'password123'
    name: 'Mohammed Al-Qahtani',
    phone: '+966505555555',
    address: 'Jeddah, Saudi Arabia',
    role: 'customer',
    active: true
  },
  {
    username: 'customer2',
    email: 'customer2@example.com',
    password: '$2a$10$XFE0rDoJcQ.zH6J.x5qlIO4CvW1gfKtc0QWkUwBnOtLECmcTUdZna', // hashed 'password123'
    name: 'Sara Ahmed',
    phone: '+966506666666',
    address: 'Dammam, Saudi Arabia',
    role: 'customer',
    active: true
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Deal.deleteMany({});
    await User.deleteMany({});
    await AnalyticsConfig.deleteMany({});
    
    console.log('Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories`);
    
    // Get category IDs
    const categoryIds = createdCategories.map(category => category._id);
    
    // Seed products
    const productsData = generateProducts(categoryIds);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${createdProducts.length} products`);
    
    // Get product IDs
    const productIds = createdProducts.map(product => product._id);
    
    // Seed deals
    const dealsData = generateDeals(categoryIds, productIds);
    const createdDeals = await Deal.insertMany(dealsData);
    console.log(`Seeded ${createdDeals.length} deals`);
    
    // Seed users
    const createdUsers = await User.insertMany(users);
    console.log(`Seeded ${createdUsers.length} users`);
    
    // Seed analytics config
    const createdAnalyticsConfig = await AnalyticsConfig.create(analyticsConfig);
    console.log('Seeded analytics configuration');
    
    console.log('Database seeding completed successfully');
    
    // Save seed data to JSON files for reference
    const dataDir = path.join(__dirname, '..', 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write data to JSON files
    fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(createdCategories, null, 2));
    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(createdProducts, null, 2));
    fs.writeFileSync(path.join(dataDir, 'deals.json'), JSON.stringify(createdDeals, null, 2));
    fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(createdUsers.map(user => {
      const userObj = user.toObject();
      delete userObj.password; // Remove password for security
      return userObj;
    }), null, 2));
    fs.writeFileSync(path.join(dataDir, 'analytics.json'), JSON.stringify(createdAnalyticsConfig, null, 2));
    
    console.log('Seed data saved to JSON files');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    return {
      categories: createdCategories.length,
      products: createdProducts.length,
      deals: createdDeals.length,
      users: createdUsers.length,
      analyticsConfig: 1
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(result => {
      console.log('Seeding results:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
