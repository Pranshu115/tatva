import mongoose from 'mongoose';

// Alternative MongoDB connection strings to try
const connectionStrings = [
  // Primary connection
  process.env.MONGODB_URI,
  
  // Alternative format without SRV
  process.env.MONGODB_URI?.replace('mongodb+srv://', 'mongodb://'),
  
  // Fallback with different options
  `mongodb+srv://Harsh:Harsh@cluster0.z0qugmf.mongodb.net/tatvaops?retryWrites=true&w=majority`,
  
  // Direct connection (if SRV fails)
  `mongodb://Harsh:Harsh@cluster0-shard-00-00.z0qugmf.mongodb.net:27017,cluster0-shard-00-01.z0qugmf.mongodb.net:27017,cluster0-shard-00-02.z0qugmf.mongodb.net:27017/tatvaops?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority`
];

const connectWithFallback = async () => {
  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    if (!uri) continue;
    
    try {
      console.log(`🔄 Trying connection method ${i + 1}...`);
      
      const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
      };
      
      const conn = await mongoose.connect(uri, options);
      console.log(`✅ Connected using method ${i + 1}`);
      return conn;
      
    } catch (error) {
      console.log(`❌ Method ${i + 1} failed: ${error.message}`);
      if (i === connectionStrings.length - 1) {
        throw new Error('All connection methods failed');
      }
    }
  }
};

export default connectWithFallback;