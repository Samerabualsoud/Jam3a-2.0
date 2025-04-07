// API routes for deals
import express from 'express';
import mongoose from 'mongoose';
import Deal from '../../models/Deal.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to JSON file if MongoDB is not available
const getDealsFromFile = () => {
  try {
    const dataPath = path.join(__dirname, '../../../data/deals.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(rawData);
    }
    return [];
  } catch (error) {
    console.error('Error reading deals from file:', error);
    return [];
  }
};

// Get all deals
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deals = await Deal.find().populate('category').sort({ createdAt: -1 });
      return res.json(deals);
    } else {
      // Fallback to JSON file
      const deals = getDealsFromFile();
      return res.json(deals);
    }
  } catch (error) {
    console.error('Error fetching deals:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    return res.json(deals);
  }
});

// Get featured deals
router.get('/featured', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const featuredDeals = await Deal.find({ featured: true }).populate('category').sort({ createdAt: -1 });
      return res.json(featuredDeals);
    } else {
      // Fallback to JSON file
      const deals = getDealsFromFile();
      const featuredDeals = deals.filter(deal => deal.featured);
      return res.json(featuredDeals);
    }
  } catch (error) {
    console.error('Error fetching featured deals:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    const featuredDeals = deals.filter(deal => deal.featured);
    return res.json(featuredDeals);
  }
});

// Get deal by ID
router.get('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findById(req.params.id).populate('category');
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      return res.json(deal);
    } else {
      // Fallback to JSON file
      const deals = getDealsFromFile();
      const deal = deals.find(d => d._id === req.params.id);
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      return res.json(deal);
    }
  } catch (error) {
    console.error('Error fetching deal:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    const deal = deals.find(d => d._id === req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    return res.json(deal);
  }
});

// Create a new deal
router.post('/', async (req, res) => {
  try {
    const {
      jam3aId,
      title,
      titleAr,
      description,
      descriptionAr,
      categoryId,
      regularPrice,
      jam3aPrice,
      maxParticipants,
      expiryDate,
      featured,
      image,
      status
    } = req.body;

    // Calculate discount percentage
    const discountPercentage = ((regularPrice - jam3aPrice) / regularPrice) * 100;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const newDeal = new Deal({
        jam3aId,
        title,
        titleAr,
        description,
        descriptionAr,
        category: categoryId,
        regularPrice,
        jam3aPrice,
        discountPercentage,
        currentParticipants: 0,
        maxParticipants,
        expiryDate,
        featured,
        image,
        status
      });

      const savedDeal = await newDeal.save();
      const populatedDeal = await Deal.findById(savedDeal._id).populate('category');
      
      return res.status(201).json(populatedDeal);
    } else {
      // Mock response for when MongoDB is not available
      const mockDeal = {
        _id: new mongoose.Types.ObjectId().toString(),
        jam3aId,
        title,
        titleAr,
        description,
        descriptionAr,
        category: { _id: categoryId, name: 'Category' },
        regularPrice,
        jam3aPrice,
        discountPercentage,
        currentParticipants: 0,
        maxParticipants,
        expiryDate,
        featured,
        image,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return res.status(201).json(mockDeal);
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Update a deal
router.put('/:id', async (req, res) => {
  try {
    const {
      jam3aId,
      title,
      titleAr,
      description,
      descriptionAr,
      categoryId,
      regularPrice,
      jam3aPrice,
      maxParticipants,
      expiryDate,
      featured,
      image,
      status
    } = req.body;

    // Calculate discount percentage
    const discountPercentage = ((regularPrice - jam3aPrice) / regularPrice) * 100;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const updatedDeal = await Deal.findByIdAndUpdate(
        req.params.id,
        {
          jam3aId,
          title,
          titleAr,
          description,
          descriptionAr,
          category: categoryId,
          regularPrice,
          jam3aPrice,
          discountPercentage,
          maxParticipants,
          expiryDate,
          featured,
          image,
          status,
          updatedAt: Date.now()
        },
        { new: true }
      ).populate('category');

      if (!updatedDeal) {
        return res.status(404).json({ message: 'Deal not found' });
      }

      return res.json(updatedDeal);
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        _id: req.params.id,
        jam3aId,
        title,
        titleAr,
        description,
        descriptionAr,
        category: { _id: categoryId, name: 'Category' },
        regularPrice,
        jam3aPrice,
        discountPercentage,
        maxParticipants,
        expiryDate,
        featured,
        image,
        status,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating deal:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
      
      if (!deletedDeal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      
      return res.json({ message: 'Deal deleted successfully' });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ message: 'Deal deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Search and filter deals
router.get('/search/filter', async (req, res) => {
  try {
    const { query, category, status, featured, minParticipants, maxParticipants } = req.query;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      
      // Text search
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { jam3aId: { $regex: query, $options: 'i' } }
        ];
      }
      
      // Category filter
      if (category && category !== 'all') {
        filter.category = category;
      }
      
      // Status filter
      if (status && status !== 'all') {
        filter.status = status;
      }
      
      // Featured filter
      if (featured === 'true') {
        filter.featured = true;
      } else if (featured === 'false') {
        filter.featured = false;
      }
      
      // Participants range filter
      if (minParticipants || maxParticipants) {
        filter.currentParticipants = {};
        if (minParticipants) {
          filter.currentParticipants.$gte = parseInt(minParticipants);
        }
        if (maxParticipants) {
          filter.currentParticipants.$lte = parseInt(maxParticipants);
        }
      }
      
      const deals = await Deal.find(filter).populate('category').sort({ createdAt: -1 });
      return res.json(deals);
    } else {
      // Fallback to JSON file
      let deals = getDealsFromFile();
      
      // Apply filters
      if (query) {
        const queryLower = query.toLowerCase();
        deals = deals.filter(deal => 
          deal.title.toLowerCase().includes(queryLower) || 
          deal.description.toLowerCase().includes(queryLower) || 
          deal.jam3aId.toLowerCase().includes(queryLower)
        );
      }
      
      if (category && category !== 'all') {
        deals = deals.filter(deal => deal.category._id === category);
      }
      
      if (status && status !== 'all') {
        deals = deals.filter(deal => deal.status === status);
      }
      
      if (featured === 'true') {
        deals = deals.filter(deal => deal.featured);
      } else if (featured === 'false') {
        deals = deals.filter(deal => !deal.featured);
      }
      
      if (minParticipants) {
        deals = deals.filter(deal => deal.currentParticipants >= parseInt(minParticipants));
      }
      
      if (maxParticipants) {
        deals = deals.filter(deal => deal.currentParticipants <= parseInt(maxParticipants));
      }
      
      return res.json(deals);
    }
  } catch (error) {
    console.error('Error searching deals:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    return res.json(deals);
  }
});

export default router;
