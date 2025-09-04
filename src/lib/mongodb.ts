import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let db: Db;
let envLoaded = false;

// Load environment variables if needed
async function loadEnvIfNeeded() {
  if (envLoaded) return;
  
  if (process.env.NODE_ENV === 'development') {
    try {
      const dotenv = await import('dotenv');
      dotenv.config();
      console.log('dotenv loaded for development');
    } catch (error) {
      console.log('dotenv not available, using system environment variables');
    }
  }
  envLoaded = true;
}

// Get environment variables with validation
function getEnvVars() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'DevRequest';
  
  console.log('Available env vars:', {
    MONGODB_URI: MONGODB_URI ? 'SET' : 'NOT SET',
    MONGODB_DB_NAME: MONGODB_DB_NAME ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  });
  
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined. Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  return { MONGODB_URI, MONGODB_DB_NAME };
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (client && db) {
    return { db, client };
  }

  // Load environment variables if needed
  await loadEnvIfNeeded();
  const { MONGODB_URI, MONGODB_DB_NAME } = getEnvVars();

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 10000, // 10 seconds timeout
    });
    
    // Add timeout to the connection
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 10000);
    });
    
    await Promise.race([connectPromise, timeoutPromise]);
    db = client.db(MONGODB_DB_NAME);
    
    console.log('Connected to MongoDB successfully');
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getRequestsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('requests');
}

// Interface para el documento de solicitud
export interface RequestDocument {
  devId: string;
  requesterEmail: string;
  country: string;
  product: string;
  planType: string;
  maxiApproval: string;
  createdAt: Date;
  updatedAt?: Date;
  modify?: boolean;
  carriers?: string;
  flowType?: string;
  trafficOrigin?: string;
  copies?: string;
  tcLinksFormatted?: string;
  // Arrays originales para repoblar formulario
  tcLinks?: string[];
  tcDescriptions?: string[];
  colors?: string[];
  colorDescriptions?: string[];
  // Campos que faltaban
  subscriptionKeywords?: string;
  priceText?: string;
  specialFunctionalities?: string;
  referenceUrl?: string;
  images?: string;
  jiraTaskKey?: string;
  languages?: string;
  logos?: string;
}