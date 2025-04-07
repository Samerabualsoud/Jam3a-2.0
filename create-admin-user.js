const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your_mongodb_connection_string';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import User model schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: {
    type: [String],
    default: ['user']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

// Admin user details
const adminUser = {
  name: 'Admin',
  email: 'admin@jam3a.me',
  password: 'Jam3a@2025',
  roles: ['user', 'admin'],
  isAdmin: true,
  emailVerified: true
};

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log('Admin user already exists. Updating to ensure admin privileges...');
      
      // Update existing user to have admin privileges
      existingUser.roles = ['user', 'admin'];
      existingUser.isAdmin = true;
      
      // Only update password if specified
      if (process.argv.includes('--reset-password')) {
        existingUser.password = adminUser.password; // Will be hashed by pre-save hook
      }
      
      await existingUser.save();
      console.log('Admin user updated successfully!');
    } else {
      // Create new admin user
      const newAdmin = new User(adminUser);
      await newAdmin.save();
      console.log('Admin user created successfully!');
    }
    
    // Display admin credentials
    console.log('\nAdmin Credentials:');
    console.log('------------------');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password} (only shown once for security)`);
    console.log('\nPlease save these credentials securely.');
    
    // Close MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Execute the function
createAdminUser();
