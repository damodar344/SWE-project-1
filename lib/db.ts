import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Check for MongoDB URI in both .env and .env.local
const MONGODB_URI = process.env.MONGODB_URI;

console.log("MongoDB URI from environment:", MONGODB_URI ? "Found" : "Not found");

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in either .env or .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      // @ts-ignore - Ignoring type error for now
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }

  try {
    const mongoose = await cached.promise;
    cached.conn = mongoose;
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
