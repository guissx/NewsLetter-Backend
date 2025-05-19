import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import UsersRouters from "../src/routes/UsersRoutes";
import AuthRoutes from "../src/routes/AuthRoutes";
import WorkoutRoutes from "../src/routes/WorkoutRoutes"

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);
app.use("/Workout", WorkoutRoutes);

app.listen(process.env.PORT);
