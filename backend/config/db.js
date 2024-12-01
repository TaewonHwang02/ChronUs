import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } 
    catch (error)
    {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB