import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import UsersRouters from "../src/routes/auth/UsersRoutes";
import AuthRoutes from "../src/routes/auth/AuthRoutes";
import CarouselRoutes from "../src//routes/components/CarouselRoutes";
import CardNewsRoutes from "../src//routes/components/CardNewsRoutes";
import EmailRoutes from "../src//routes/email/EmailRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);
app.use("/carouselAdm", CarouselRoutes);
app.use("/CardAdm", CardNewsRoutes);
app.use("/email", EmailRoutes);

export default app;
