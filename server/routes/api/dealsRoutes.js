const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Get all deals
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    console.error('Error fetching deals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific deal
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findOne({ id: req.params.id });
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json(deal);
  } catch (err) {
    console.error('Error fetching deal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new deal
router.post('/', async (req, res) => {
  try {
    // Find the highest ID to ensure uniqueness
    const maxIdDeal = await Deal.findOne().sort('-id');
    const newId = maxIdDeal ? maxIdDeal.id + 1 : 1;
    
    // Generate a Jam3a ID if not provided
    let jam3aId = req.body.jam3aId;
    if (!jam3aId) {
      const category = req.body.category.substring(0, 3).toUpperCase();
      jam3aId = `JAM-${category}-${String(newId).padStart(3, '0')}`;
    }
    
    const newDeal = new Deal({
      id: newId,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      currentAmount: req.body.currentAmount || 0,
      targetAmount: req.body.targetAmount,
      jam3aId: jam3aId,
      featured: req.body.featured || false,
      usersJoined: req.body.usersJoined || 0,
      imageUrl: req.body.imageUrl,
      status: req.body.status || 'active'
    });
    
    const savedDeal = await newDeal.save();
    res.status(201).json(savedDeal);
  } catch (err) {
    console.error('Error creating deal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a deal
router.put('/:id', async (req, res) => {
  try {
    const updatedDeal = await Deal.findOneAndUpdate(
      { id: req.params.id },
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json(updatedDeal);
  } catch (err) {
    console.error('Error updating deal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  try {
    const deletedDeal = await Deal.findOneAndDelete({ id: req.params.id });
    
    if (!deletedDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json({ message: 'Deal deleted successfully' });
  } catch (err) {
    console.error('Error deleting deal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search and filter deals
router.get('/search/filter', async (req, res) => {
  try {
    const { query, category, status, minUsers, maxUsers, featured } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { jam3aId: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (minUsers) {
      filter.usersJoined = { $gte: parseInt(minUsers) };
    }
    
    if (maxUsers) {
      filter.usersJoined = { ...filter.usersJoined, $lte: parseInt(maxUsers) };
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    const deals = await Deal.find(filter);
    res.json(deals);
  } catch (err) {
    console.error('Error searching deals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured deals
router.get('/featured/list', async (req, res) => {
  try {
    const featuredDeals = await Deal.find({ featured: true });
    res.json(featuredDeals);
  } catch (err) {
    console.error('Error fetching featured deals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active Jam3a deals
router.get('/jam3a/deals', async (req, res) => {
  try {
    const activeDeals = await Deal.find({ 
      status: 'active',
      currentAmount: { $gt: 0 },
      targetAmount: { $gt: 0 }
    });
    res.json(activeDeals);
  } catch (err) {
    console.error('Error fetching active Jam3a deals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
