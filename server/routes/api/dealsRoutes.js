// API routes for deals
import express from 'express';
import mongoose from 'mongoose';
import Deal from '../../models/Deal.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, authorize, optionalAuth, refreshToken } from '../../middleware/auth.js';
import { validate, validationRules, sanitizeInputs } from '../../middleware/validation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply token refresh middleware to all routes
router.use(refreshToken);

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

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

// Get all deals - Public route with optional auth
router.get('/', optionalAuth, async (req, res) => {
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

// Get featured deals - Public route with optional auth
router.get('/featured', optionalAuth, async (req, res) => {
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

// Get deal by ID - Public route with optional auth
router.get('/:id', optionalAuth, validate(validationRules.id), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findById(req.params.id).populate('category');
      if (!deal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Deal not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      return res.json(deal);
    } else {
      // Fallback to JSON file
      const deals = getDealsFromFile();
      const deal = deals.find(d => d._id === req.params.id);
      if (!deal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Deal not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      return res.json(deal);
    }
  } catch (error) {
    console.error('Error fetching deal:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    const deal = deals.find(d => d._id === req.params.id);
    if (!deal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deal not found',
        code: 'RESOURCE_NOT_FOUND'
      });
    }
    return res.json(deal);
  }
});

// Create a new deal - Admin or seller only
router.post('/', auth, authorize(['admin', 'seller']), validate(validationRules.deal.create), async (req, res) => {
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
        status,
        createdBy: req.user.id // Add creator reference
      });

      const savedDeal = await newDeal.save();
      const populatedDeal = await Deal.findById(savedDeal._id).populate('category');
      
      return res.status(201).json({
        success: true,
        data: populatedDeal
      });
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
        createdBy: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return res.status(201).json({
        success: true,
        data: mockDeal
      });
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Update a deal - Admin or creator only
router.put('/:id', auth, validate(validationRules.id), validate(validationRules.deal.update), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // First check if user is authorized to update this deal
      const deal = await Deal.findById(req.params.id);
      if (!deal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Deal not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      // Check if user is admin or the creator of the deal
      if (req.user.role !== 'admin' && (!deal.createdBy || deal.createdBy.toString() !== req.user.id)) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to update this deal',
          code: 'AUTH_INSUFFICIENT_PERMISSIONS'
        });
      }
      
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

      // Calculate discount percentage if prices are provided
      let discountPercentage;
      if (regularPrice && jam3aPrice) {
        discountPercentage = ((regularPrice - jam3aPrice) / regularPrice) * 100;
      }

      const updateData = {
        ...(jam3aId && { jam3aId }),
        ...(title && { title }),
        ...(titleAr && { titleAr }),
        ...(description && { description }),
        ...(descriptionAr && { descriptionAr }),
        ...(categoryId && { category: categoryId }),
        ...(regularPrice && { regularPrice }),
        ...(jam3aPrice && { jam3aPrice }),
        ...(discountPercentage && { discountPercentage }),
        ...(maxParticipants && { maxParticipants }),
        ...(expiryDate && { expiryDate }),
        ...(featured !== undefined && { featured }),
        ...(image && { image }),
        ...(status && { status }),
        updatedAt: Date.now(),
        updatedBy: req.user.id
      };

      const updatedDeal = await Deal.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('category');

      return res.json({
        success: true,
        data: updatedDeal
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        success: true,
        data: {
          _id: req.params.id,
          ...req.body,
          updatedAt: new Date(),
          updatedBy: req.user.id
        }
      });
    }
  } catch (error) {
    console.error('Error updating deal:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Delete a deal - Admin only
router.delete('/:id', auth, authorize(['admin']), validate(validationRules.id), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
      
      if (!deletedDeal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Deal not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      return res.json({ 
        success: true, 
        message: 'Deal deleted successfully' 
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ 
        success: true, 
        message: 'Deal deleted successfully' 
      });
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Search and filter deals - Public route with optional auth
router.get('/search/filter', optionalAuth, validate(validationRules.pagination), async (req, res) => {
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
      return res.json({
        success: true,
        data: deals
      });
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
      
      return res.json({
        success: true,
        data: deals
      });
    }
  } catch (error) {
    console.error('Error searching deals:', error);
    // Fallback to JSON file on error
    const deals = getDealsFromFile();
    return res.json({
      success: true,
      data: deals
    });
  }
});

export default router;
