require('dotenv').config();

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_BASE_URL || 'https://api.jam3a.me/api',
    frontendUrl: process.env.FRONTEND_URL || 'https://jam3a.me'
  },
  
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jam3a',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // Removed deprecated options:
      // useCreateIndex: true,
      // useFindAndModify: false
    }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret_key',
    expiresIn: '1d',
    refreshExpiresIn: '7d'
  },
  
  // Moyasser payment gateway configuration
  moyasser: {
    apiKey: process.env.MOYASSER_API_KEY,
    secretKey: process.env.MOYASSER_SECRET_KEY,
    apiUrl: process.env.MOYASSER_API_URL || 'https://api.moyasser.com/v1',
    webhookSecret: process.env.MOYASSER_WEBHOOK_SECRET
  },
  
  // Email configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'outlook',
    user: process.env.EMAIL_USER || 'Samer@jam3a.me',
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'Jam3a Platform <Samer@jam3a.me>'
  },
  
  // CORS configuration
  cors: {
    origin: ['https://shark-app-b8fxh.ondigitalocean.app', process.env.FRONTEND_URL || 'https://jam3a.me'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  }
};
