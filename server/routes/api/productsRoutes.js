// productsRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to our data file
const dataPath = path.join(__dirname, '../../data/products.json');

// Ensure data directory exists
const ensureDataDirExists = () => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize products data file if it doesn't exist
const initializeProductsData = () => {
  ensureDataDirExists();
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  }
};

// Get all products
router.get('/', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(productsData);
  } catch (error) {
    console.error('Error reading products data:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a specific product by ID
router.get('/:id', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const product = productsData.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error reading product data:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a new product
router.post('/', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Generate a new ID (max ID + 1)
    const newId = productsData.length > 0 
      ? Math.max(...productsData.map(p => p.id)) + 1 
      : 1;
    
    const newProduct = {
      id: newId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    productsData.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update an existing product
router.put('/:id', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const productId = parseInt(req.params.id);
    const productIndex = productsData.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = {
      ...productsData[productIndex],
      ...req.body,
      id: productId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    productsData[productIndex] = updatedProduct;
    fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const productId = parseInt(req.params.id);
    const productIndex = productsData.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    productsData.splice(productIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Bulk operations
router.post('/bulk', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { action, ids, data } = req.body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    let result;
    
    switch (action) {
      case 'delete':
        // Delete multiple products
        const remainingProducts = productsData.filter(p => !ids.includes(p.id));
        fs.writeFileSync(dataPath, JSON.stringify(remainingProducts, null, 2));
        result = { deleted: productsData.length - remainingProducts.length };
        break;
        
      case 'update':
        // Update multiple products
        if (!data) {
          return res.status(400).json({ error: 'Data required for bulk update' });
        }
        
        let updatedCount = 0;
        const updatedProducts = productsData.map(product => {
          if (ids.includes(product.id)) {
            updatedCount++;
            return {
              ...product,
              ...data,
              id: product.id, // Ensure ID doesn't change
              updatedAt: new Date().toISOString()
            };
          }
          return product;
        });
        
        fs.writeFileSync(dataPath, JSON.stringify(updatedProducts, null, 2));
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

// Get Jam3a deals
router.get('/jam3a/deals', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Filter products that have Jam3a deal properties
    const jam3aDeals = productsData.filter(product => 
      product.currentAmount !== undefined && 
      product.targetAmount !== undefined
    );
    
    res.json(jam3aDeals);
  } catch (error) {
    console.error('Error fetching Jam3a deals:', error);
    res.status(500).json({ error: 'Failed to fetch Jam3a deals' });
  }
});

// Get featured products
router.get('/featured', (req, res) => {
  try {
    initializeProductsData();
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Filter featured products
    const featuredProducts = productsData.filter(product => product.featured);
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

module.exports = router;
