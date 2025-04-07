// dealsRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to our data file
const dataPath = path.join(__dirname, '../../data/deals.json');

// Ensure data directory exists
const ensureDataDirExists = () => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize deals data file if it doesn't exist
const initializeDealsData = () => {
  ensureDataDirExists();
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  }
};

// Get all deals
router.get('/', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(dealsData);
  } catch (error) {
    console.error('Error reading deals data:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get a specific deal by ID
router.get('/:id', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const deal = dealsData.find(d => d.id === parseInt(req.params.id));
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.json(deal);
  } catch (error) {
    console.error('Error reading deal data:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Create a new deal
router.post('/', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Generate a new ID (max ID + 1)
    const newId = dealsData.length > 0 
      ? Math.max(...dealsData.map(d => d.id)) + 1 
      : 1;
    
    const newDeal = {
      id: newId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dealsData.push(newDeal);
    fs.writeFileSync(dataPath, JSON.stringify(dealsData, null, 2));
    
    res.status(201).json(newDeal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update an existing deal
router.put('/:id', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const dealId = parseInt(req.params.id);
    const dealIndex = dealsData.findIndex(d => d.id === dealId);
    
    if (dealIndex === -1) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    const updatedDeal = {
      ...dealsData[dealIndex],
      ...req.body,
      id: dealId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    dealsData[dealIndex] = updatedDeal;
    fs.writeFileSync(dataPath, JSON.stringify(dealsData, null, 2));
    
    res.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete a deal
router.delete('/:id', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const dealId = parseInt(req.params.id);
    const dealIndex = dealsData.findIndex(d => d.id === dealId);
    
    if (dealIndex === -1) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    dealsData.splice(dealIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(dealsData, null, 2));
    
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Bulk operations
router.post('/bulk', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { action, ids, data } = req.body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    let result;
    
    switch (action) {
      case 'delete':
        // Delete multiple deals
        const remainingDeals = dealsData.filter(d => !ids.includes(d.id));
        fs.writeFileSync(dataPath, JSON.stringify(remainingDeals, null, 2));
        result = { deleted: dealsData.length - remainingDeals.length };
        break;
        
      case 'update':
        // Update multiple deals
        if (!data) {
          return res.status(400).json({ error: 'Data required for bulk update' });
        }
        
        let updatedCount = 0;
        const updatedDeals = dealsData.map(deal => {
          if (ids.includes(deal.id)) {
            updatedCount++;
            return {
              ...deal,
              ...data,
              id: deal.id, // Ensure ID doesn't change
              updatedAt: new Date().toISOString()
            };
          }
          return deal;
        });
        
        fs.writeFileSync(dataPath, JSON.stringify(updatedDeals, null, 2));
        result = { updated: updatedCount };
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    res.status(500).json({ error: 'Failed to perform bulk operation' });
  }
});

// Search and filter deals
router.get('/search/filter', (req, res) => {
  try {
    initializeDealsData();
    const dealsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    const { 
      query, 
      category, 
      jam3aStatus, 
      minUsers, 
      maxUsers,
      featured 
    } = req.query;
    
    let filteredDeals = [...dealsData];
    
    // Apply search query filter
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.name?.toLowerCase().includes(searchTerm) || 
        deal.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (category) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply Jam3a status filter
    if (jam3aStatus) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.jam3aStatus?.toLowerCase() === jam3aStatus.toLowerCase()
      );
    }
    
    // Apply users count filter
    if (minUsers !== undefined) {
      filteredDeals = filteredDeals.filter(deal => 
        (deal.currentUsers || 0) >= parseInt(minUsers)
      );
    }
    
    if (maxUsers !== undefined) {
      filteredDeals = filteredDeals.filter(deal => 
        (deal.currentUsers || 0) <= parseInt(maxUsers)
      );
    }
    
    // Apply featured filter
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      filteredDeals = filteredDeals.filter(deal => 
        deal.featured === isFeatured
      );
    }
    
    res.json(filteredDeals);
  } catch (error) {
    console.error('Error searching/filtering deals:', error);
    res.status(500).json({ error: 'Failed to search/filter deals' });
  }
});

module.exports = router;
