const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Content = require('../models/Content');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   GET /api/content
 * @desc    Get all content with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      status,
      language,
      search,
      page = 1, 
      limit = 10,
      sort = 'position',
      order = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query
    const content = await Content.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Content.countDocuments(filter);
    
    // Process content based on language
    const processedContent = content.map(item => {
      if (language === 'ar') {
        return {
          ...item.toObject(),
          localizedContent: item.getLocalizedContent('ar')
        };
      }
      return {
        ...item.toObject(),
        localizedContent: item.getLocalizedContent('en')
      };
    });
    
    res.json({
      content: processedContent,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/content/:id
 * @desc    Get content by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/content/key/:key
 * @desc    Get content by key
 * @access  Public
 */
router.get('/key/:key', async (req, res) => {
  try {
    const { language } = req.query;
    
    const content = await Content.findOne({ key: req.params.key });
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    // Return localized content if language is specified
    if (language) {
      const localizedContent = content.getLocalizedContent(language);
      return res.json({
        ...content.toObject(),
        localizedContent
      });
    }
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/content
 * @desc    Create new content
 * @access  Private/Admin
 */
router.post('/', [
  // auth, admin,
  [
    check('type', 'Type is required').isIn(['page', 'section', 'banner', 'faq', 'testimonial']),
    check('key', 'Key is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      type, 
      key, 
      title, 
      titleAr, 
      content, 
      contentAr, 
      status, 
      metadata,
      position,
      parent
    } = req.body;

    // Check if content with this key already exists
    const existingContent = await Content.findOne({ key });
    if (existingContent) {
      return res.status(400).json({ msg: 'Content with this key already exists' });
    }

    // Create new content
    const newContent = new Content({
      type,
      key,
      title,
      titleAr,
      content,
      contentAr,
      status: status || 'draft',
      metadata,
      position: position || 0,
      parent
    });

    await newContent.save();
    
    res.json(newContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/content/:id
 * @desc    Update content
 * @access  Private/Admin
 */
router.put('/:id', [
  // auth, admin,
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('content', 'Content is required').optional().not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    // Update fields
    const updateFields = req.body;
    Object.keys(updateFields).forEach(field => {
      content[field] = updateFields[field];
    });
    
    await content.save();
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content
 * @access  Private/Admin
 */
router.delete('/:id', [
  // auth, admin
], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    await content.remove();
    
    res.json({ msg: 'Content removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/content/:id/publish
 * @desc    Publish content
 * @access  Private/Admin
 */
router.post('/:id/publish', [
  // auth, admin
], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    await content.publish();
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/content/:id/unpublish
 * @desc    Unpublish content
 * @access  Private/Admin
 */
router.post('/:id/unpublish', [
  // auth, admin
], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    await content.unpublish();
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;
