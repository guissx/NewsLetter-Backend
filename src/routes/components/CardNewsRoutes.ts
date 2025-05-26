import express from "express";
import { authenticateToken } from "../../middlewares/authmiddlewares";
import upload from "../../middlewares/upload";
import {
  createNewsItem,
  getAllNewsItems,
  getNewsItemById,
  updateNewsItem,
  deleteNewsItem
} from "../../controllers/components/cardNews.controller"; 

const router = express.Router();

router.post("/",upload.single("image"),authenticateToken, createNewsItem);
router.get("/", getAllNewsItems);
router.get("/:id", getNewsItemById);
router.put("/:id",authenticateToken, updateNewsItem);
router.delete("/:id",authenticateToken, deleteNewsItem);

export default router;
