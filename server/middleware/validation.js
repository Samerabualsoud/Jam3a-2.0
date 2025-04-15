const { body, param, query, validationResult, sanitizeBody } = require('express-validator');
const Joi = require('joi');
const xss = require('xss');
const mongoose = require('mongoose');

/**
 * Enhanced Express-validator middleware for validating requests
 * Provides consistent error responses and detailed validation
 * @param {Array} validations - Array of express-validator validation rules
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array(),
        message: 'Validation failed',
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  };
};

/**
 * Sanitize request body to prevent XSS attacks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    // Recursively sanitize all string values in the request body
    const sanitizeObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          // Apply XSS sanitization to string values
          obj[key] = xss(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively sanitize nested objects
          sanitizeObject(obj[key]);
        }
      });
      
      return obj;
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

/**
 * Validate MongoDB ObjectId
 * @param {String} id - ID to validate
 * @returns {Boolean} - Whether the ID is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Common validation rules for different entities
 * Enhanced with more comprehensive validation and sanitization
 */
const validationRules = {
  // User validation rules
  user: {
    register: [
      body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-_.]+$/).withMessage('Name contains invalid characters'),
      body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail()
        .custom(async (email, { req }) => {
          // In a real implementation, you would check if email already exists in database
          // This is a placeholder for the custom validation
          if (email === 'admin@example.com' && req.body.role !== 'admin') {
            throw new Error('This email is reserved');
          }
          return true;
        }),
      body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      body('confirmPassword')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match');
          }
          return true;
        }),
      body('phone')
        .optional()
        .isMobilePhone().withMessage('Valid phone number is required')
        .customSanitizer(value => {
          // Remove any non-digit characters
          return value ? value.replace(/\D/g, '') : value;
        }),
      body('address')
        .optional()
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),
      body('role')
        .optional()
        .isIn(['user', 'admin', 'seller']).withMessage('Invalid role specified')
    ],
    login: [
      body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
      body('password')
        .notEmpty().withMessage('Password is required')
    ],
    update: [
      body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-_.]+$/).withMessage('Name contains invalid characters'),
      body('email')
        .optional()
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
      body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      body('phone')
        .optional()
        .isMobilePhone().withMessage('Valid phone number is required')
        .customSanitizer(value => {
          // Remove any non-digit characters
          return value ? value.replace(/\D/g, '') : value;
        }),
      body('address')
        .optional()
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),
      body('role')
        .optional()
        .isIn(['user', 'admin', 'seller']).withMessage('Invalid role specified')
    ]
  },
  
  // Product validation rules
  product: {
    create: [
      body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
      body('nameAr')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Arabic product name must be between 3 and 100 characters'),
      body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
      body('descriptionAr')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 }).withMessage('Arabic description must be between 10 and 2000 characters'),
      body('price')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
      body('salePrice')
        .optional()
        .isNumeric().withMessage('Sale price must be a number')
        .isFloat({ min: 0 }).withMessage('Sale price must be 0 or greater')
        .custom((value, { req }) => {
          if (value && parseFloat(value) >= parseFloat(req.body.price)) {
            throw new Error('Sale price must be less than regular price');
          }
          return true;
        }),
      body('category')
        .notEmpty().withMessage('Category is required')
        .custom(value => {
          if (!isValidObjectId(value)) {
            throw new Error('Invalid category ID format');
          }
          return true;
        }),
      body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
      body('tags.*')
        .optional()
        .isString().withMessage('Each tag must be a string')
        .isLength({ min: 2, max: 20 }).withMessage('Each tag must be between 2 and 20 characters'),
      body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
      body('featured')
        .optional()
        .isBoolean().withMessage('Featured must be a boolean value'),
      body('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be valid'),
      body('additionalImages')
        .optional()
        .isArray().withMessage('Additional images must be an array'),
      body('additionalImages.*')
        .optional()
        .isURL().withMessage('Each additional image URL must be valid'),
      body('specifications')
        .optional()
        .isObject().withMessage('Specifications must be an object')
    ],
    update: [
      body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
      body('nameAr')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Arabic product name must be between 3 and 100 characters'),
      body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty')
        .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
      body('descriptionAr')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 }).withMessage('Arabic description must be between 10 and 2000 characters'),
      body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
      body('salePrice')
        .optional()
        .isNumeric().withMessage('Sale price must be a number')
        .isFloat({ min: 0 }).withMessage('Sale price must be 0 or greater')
        .custom((value, { req }) => {
          if (value && req.body.price && parseFloat(value) >= parseFloat(req.body.price)) {
            throw new Error('Sale price must be less than regular price');
          }
          return true;
        }),
      body('category')
        .optional()
        .notEmpty().withMessage('Category cannot be empty')
        .custom(value => {
          if (!isValidObjectId(value)) {
            throw new Error('Invalid category ID format');
          }
          return true;
        }),
      body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
      body('tags.*')
        .optional()
        .isString().withMessage('Each tag must be a string')
        .isLength({ min: 2, max: 20 }).withMessage('Each tag must be between 2 and 20 characters'),
      body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
      body('featured')
        .optional()
        .isBoolean().withMessage('Featured must be a boolean value'),
      body('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be valid'),
      body('additionalImages')
        .optional()
        .isArray().withMessage('Additional images must be an array'),
      body('additionalImages.*')
        .optional()
        .isURL().withMessage('Each additional image URL must be valid'),
      body('specifications')
        .optional()
        .isObject().withMessage('Specifications must be an object')
    ]
  },
  
  // Deal validation rules
  deal: {
    create: [
      body('title')
        .trim()
        .notEmpty().withMessage('Deal title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
      body('titleAr')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 }).withMessage('Arabic title must be between 5 and 100 characters'),
      body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
      body('descriptionAr')
        .optional()
        .trim()
        .isLength({ min: 20, max: 2000 }).withMessage('Arabic description must be between 20 and 2000 characters'),
      body('productId')
        .notEmpty().withMessage('Product ID is required')
        .custom(value => {
          if (!isValidObjectId(value)) {
            throw new Error('Invalid product ID format');
          }
          return true;
        }),
      body('regularPrice')
        .isNumeric().withMessage('Regular price must be a number')
        .isFloat({ min: 0.01 }).withMessage('Regular price must be greater than 0'),
      body('jam3aPrice')
        .isNumeric().withMessage('Jam3a price must be a number')
        .isFloat({ min: 0.01 }).withMessage('Jam3a price must be greater than 0')
        .custom((value, { req }) => {
          if (parseFloat(value) >= parseFloat(req.body.regularPrice)) {
            throw new Error('Jam3a price must be less than regular price');
          }
          return true;
        }),
      body('minParticipants')
        .isInt({ min: 2 }).withMessage('Minimum participants must be at least 2'),
      body('maxParticipants')
        .isInt({ min: 2 }).withMessage('Maximum participants must be at least 2')
        .custom((value, { req }) => {
          if (parseInt(value) < parseInt(req.body.minParticipants)) {
            throw new Error('Maximum participants must be greater than or equal to minimum participants');
          }
          return true;
        }),
      body('expiryDate')
        .isISO8601().withMessage('Valid expiry date is required')
        .custom(value => {
          const expiryDate = new Date(value);
          const now = new Date();
          if (expiryDate <= now) {
            throw new Error('Expiry date must be in the future');
          }
          return true;
        }),
      body('featured')
        .optional()
        .isBoolean().withMessage('Featured must be a boolean value'),
      body('image')
        .optional()
        .isURL().withMessage('Image URL must be valid'),
      body('status')
        .optional()
        .isIn(['active', 'pending', 'completed', 'cancelled']).withMessage('Invalid status')
    ],
    update: [
      body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Deal title cannot be empty')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
      body('titleAr')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 }).withMessage('Arabic title must be between 5 and 100 characters'),
      body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty')
        .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
      body('descriptionAr')
        .optional()
        .trim()
        .isLength({ min: 20, max: 2000 }).withMessage('Arabic description must be between 20 and 2000 characters'),
      body('minParticipants')
        .optional()
        .isInt({ min: 2 }).withMessage('Minimum participants must be at least 2'),
      body('maxParticipants')
        .optional()
        .isInt({ min: 2 }).withMessage('Maximum participants must be at least 2')
        .custom((value, { req }) => {
          if (req.body.minParticipants && parseInt(value) < parseInt(req.body.minParticipants)) {
            throw new Error('Maximum participants must be greater than or equal to minimum participants');
          }
          return true;
        }),
      body('expiryDate')
        .optional()
        .isISO8601().withMessage('Valid expiry date is required')
        .custom(value => {
          const expiryDate = new Date(value);
          const now = new Date();
          if (expiryDate <= now) {
            throw new Error('Expiry date must be in the future');
          }
          return true;
        }),
      body('featured')
        .optional()
        .isBoolean().withMessage('Featured must be a boolean value'),
      body('image')
        .optional()
        .isURL().withMessage('Image URL must be valid'),
      body('status')
        .optional()
        .isIn(['active', 'pending', 'completed', 'cancelled']).withMessage('Invalid status')
    ],
    join: [
      body('userId')
        .notEmpty().withMessage('User ID is required')
        .custom(value => {
          if (!isValidObjectId(value)) {
            throw new Error('Invalid user ID format');
          }
          return true;
        })
    ]
  },
  
  // File upload validation rules
  fileUpload: {
    image: [
      body('file')
        .custom((value, { req }) => {
          if (!req.file) {
            throw new Error('Image file is required');
          }
          
          // Check file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error('Only JPG, PNG, GIF, and WebP images are allowed');
          }
          
          // Check file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
          if (req.file.size > maxSize) {
            throw new Error('Image size must not exceed 5MB');
          }
          
          return true;
        })
    ],
    document: [
      body('file')
        .custom((value, { req }) => {
          if (!req.file) {
            throw new Error('Document file is required');
          }
          
          // Check file type
          const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error('Only PDF and Word documents are allowed');
          }
          
          // Check file size (10MB limit)
          const maxSize = 10 * 1024 * 1024; // 10MB in bytes
          if (req.file.size > maxSize) {
            throw new Error('Document size must not exceed 10MB');
          }
          
          return true;
        })
    ],
    any: [
      body('file')
        .custom((value, { req }) => {
          if (!req.file) {
            throw new Error('File is required');
          }
          
          // Check file size (20MB limit)
          const maxSize = 20 * 1024 * 1024; // 20MB in bytes
          if (req.file.size > maxSize) {
            throw new Error('File size must not exceed 20MB');
          }
          
          return true;
        })
    ]
  },
  
  // ID parameter validation
  id: [
    param('id')
      .notEmpty().withMessage('ID parameter is required')
      .custom(value => {
        if (!isValidObjectId(value)) {
          throw new Error('Invalid ID format');
        }
        return true;
      })
  ],
  
  // Query parameter validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  
  // Analytics validation rules
  analytics: [
    body('trackingId')
      .optional()
      .isString().withMessage('Tracking ID must be a string'),
    body('ipAnonymization')
      .optional()
      .isBoolean().withMessage('IP anonymization must be a boolean value'),
    body('trackPageViews')
      .optional()
      .isBoolean().withMessage('Track page views must be a boolean value'),
    body('trackEvents')
      .optional()
      .isBoolean().withMessage('Track events must be a boolean value'),
    body('ecommerceTracking')
      .optional()
      .isBoolean().withMessage('Ecommerce tracking must be a boolean value'),
    body('active')
      .optional()
      .isBoolean().withMessage('Active must be a boolean value')
  ]
};

/**
 * Enhanced Joi schema validation middleware
 * Provides consistent error responses
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Source of data to validate (body, query, params)
 */
const validateWithJoi = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const options = { 
      abortEarly: false,
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert values to the correct type when possible
    };
    
    const { error, value } = schema.validate(data, options);
    
    if (error) {
      const errors = error.details.map(detail => ({
        param: detail.path.join('.'),
        msg: detail.message,
        location: source
      }));
      
      return res.status(400).json({ 
        success: false,
        errors,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Replace the request data with the validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Enhanced Joi schemas for different entities
 * With more comprehensive validation and sanitization
 */
const joiSchemas = {
  // User validation schemas
  user: {
    register: Joi.object({
      name: Joi.string().trim().min(2).max(50).required()
        .pattern(/^[a-zA-Z0-9\s\-_.]+$/)
        .message('Name contains invalid characters'),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      confirmPassword: Joi.string().valid(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords do not match' }),
      phone: Joi.string().allow('', null),
      address: Joi.string().max(200).allow('', null),
      role: Joi.string().valid('user', 'admin', 'seller').default('user')
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    update: Joi.object({
      name: Joi.string().trim().min(2).max(50)
        .pattern(/^[a-zA-Z0-9\s\-_.]+$/)
        .message('Name contains invalid characters'),
      email: Joi.string().email(),
      password: Joi.string().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      phone: Joi.string().allow('', null),
      address: Joi.string().max(200).allow('', null),
      role: Joi.string().valid('user', 'admin', 'seller')
    }).min(1) // At least one field must be present
  },
  
  // Product validation schemas
  product: {
    create: Joi.object({
      name: Joi.string().trim().min(3).max(100).required(),
      nameAr: Joi.string().trim().min(3).max(100),
      description: Joi.string().trim().min(10).max(2000).required(),
      descriptionAr: Joi.string().trim().min(10).max(2000),
      price: Joi.number().positive().required(),
      salePrice: Joi.number().min(0).less(Joi.ref('price')),
      category: Joi.string().required().custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.error('string.objectId', { value });
        }
        return value;
      }, 'MongoDB ObjectId validation'),
      tags: Joi.array().items(Joi.string().min(2).max(20)),
      stock: Joi.number().integer().min(0).default(0),
      featured: Joi.boolean().default(false),
      imageUrl: Joi.string().uri(),
      additionalImages: Joi.array().items(Joi.string().uri()),
      specifications: Joi.object()
    }),
    update: Joi.object({
      name: Joi.string().trim().min(3).max(100),
      nameAr: Joi.string().trim().min(3).max(100),
      description: Joi.string().trim().min(10).max(2000),
      descriptionAr: Joi.string().trim().min(10).max(2000),
      price: Joi.number().positive(),
      salePrice: Joi.number().min(0).when('price', {
        is: Joi.exist(),
        then: Joi.number().less(Joi.ref('price')),
        otherwise: Joi.number().min(0)
      }),
      category: Joi.string().custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.error('string.objectId', { value });
        }
        return value;
      }, 'MongoDB ObjectId validation'),
      tags: Joi.array().items(Joi.string().min(2).max(20)),
      stock: Joi.number().integer().min(0),
      featured: Joi.boolean(),
      imageUrl: Joi.string().uri(),
      additionalImages: Joi.array().items(Joi.string().uri()),
      specifications: Joi.object()
    }).min(1) // At least one field must be present
  },
  
  // Deal validation schemas
  deal: {
    create: Joi.object({
      title: Joi.string().trim().min(5).max(100).required(),
      titleAr: Joi.string().trim().min(5).max(100),
      description: Joi.string().trim().min(20).max(2000).required(),
      descriptionAr: Joi.string().trim().min(20).max(2000),
      productId: Joi.string().required().custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.error('string.objectId', { value });
        }
        return value;
      }, 'MongoDB ObjectId validation'),
      regularPrice: Joi.number().positive().required(),
      jam3aPrice: Joi.number().positive().less(Joi.ref('regularPrice')).required(),
      minParticipants: Joi.number().integer().min(2).required(),
      maxParticipants: Joi.number().integer().min(Joi.ref('minParticipants')).required(),
      expiryDate: Joi.date().greater('now').required(),
      featured: Joi.boolean().default(false),
      image: Joi.string().uri(),
      status: Joi.string().valid('active', 'pending', 'completed', 'cancelled').default('pending')
    }),
    update: Joi.object({
      title: Joi.string().trim().min(5).max(100),
      titleAr: Joi.string().trim().min(5).max(100),
      description: Joi.string().trim().min(20).max(2000),
      descriptionAr: Joi.string().trim().min(20).max(2000),
      minParticipants: Joi.number().integer().min(2),
      maxParticipants: Joi.number().integer().when('minParticipants', {
        is: Joi.exist(),
        then: Joi.number().integer().min(Joi.ref('minParticipants')),
        otherwise: Joi.number().integer().min(2)
      }),
      expiryDate: Joi.date().greater('now'),
      featured: Joi.boolean(),
      image: Joi.string().uri(),
      status: Joi.string().valid('active', 'pending', 'completed', 'cancelled')
    }).min(1) // At least one field must be present
  },
  
  // Analytics validation schema
  analytics: {
    config: Joi.object({
      trackingId: Joi.string().allow(''),
      ipAnonymization: Joi.boolean(),
      trackPageViews: Joi.boolean(),
      trackEvents: Joi.boolean(),
      ecommerceTracking: Joi.boolean(),
      active: Joi.boolean()
    }).min(1) // At least one field must be present
  },
  
  // Category validation schema
  category: {
    create: Joi.object({
      name: Joi.string().trim().min(2).max(50).required(),
      nameAr: Joi.string().trim().min(2).max(50),
      description: Joi.string().trim().max(500).allow('', null),
      descriptionAr: Joi.string().trim().max(500).allow('', null),
      parentId: Joi.string().allow(null, '').custom((value, helpers) => {
        if (value && !isValidObjectId(value)) {
          return helpers.error('string.objectId', { value });
        }
        return value;
      }, 'MongoDB ObjectId validation'),
      image: Joi.string().uri().allow('', null),
      featured: Joi.boolean().default(false)
    }),
    update: Joi.object({
      name: Joi.string().trim().min(2).max(50),
      nameAr: Joi.string().trim().min(2).max(50),
      description: Joi.string().trim().max(500).allow('', null),
      descriptionAr: Joi.string().trim().max(500).allow('', null),
      parentId: Joi.string().allow(null, '').custom((value, helpers) => {
        if (value && !isValidObjectId(value)) {
          return helpers.error('string.objectId', { value });
        }
        return value;
      }, 'MongoDB ObjectId validation'),
      image: Joi.string().uri().allow('', null),
      featured: Joi.boolean()
    }).min(1) // At least one field must be present
  },
  
  // Pagination schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt')
  })
};

// Add custom error messages for Joi
Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.objectId': '{{#label}} must be a valid MongoDB ObjectId'
  }
}));

module.exports = {
  validate,
  sanitizeInputs,
  isValidObjectId,
  validationRules,
  validateWithJoi,
  joiSchemas
};
