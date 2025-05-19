import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  
  if (isConnected) {
    console.log("Usando conexão existente com o MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Atlas conectado com sucesso!");
    isConnected = true;
  } catch (error) {
    console.error("❌ Erro ao conectar com o MongoDB Atlas:", error);
    process.exit(1);
  }
};
