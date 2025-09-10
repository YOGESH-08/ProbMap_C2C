import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionObj = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(`Successfully connected to database`);
  } catch (error) {
    console.log("Database connection failed: ",error);
    process.exit(1);
  }
};

export default connectDB;
