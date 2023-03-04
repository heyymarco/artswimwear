import mongoose from 'mongoose'



export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI!);
    }
    catch (error) {
        console.log(error)
    }
}