import mongoose from "mongoose";//mongoose is a tool that helps connect and interact with MongoDB, a type of database.

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            
            serverSelectionTimeoutMS: 5000 // Optional: Adjust timeout if needed  If it can't connect within 5 seconds, it stops trying and reports an error
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

export default connectDB;
