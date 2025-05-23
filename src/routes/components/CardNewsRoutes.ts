import express from "express";
import { authenticateToken } from "../../middlewares/authmiddlewares";
import {
  createNewsItem,
  getAllNewsItems,
  getNewsItemById,
  updateNewsItem,
  deleteNewsItem
} from "../../controllers/components/cardNews.controller"; 

const router = express.Router();

router.post("/",authenticateToken, createNewsItem);
router.get("/",authenticateToken, getAllNewsItems);
router.get("/:id",authenticateToken, getNewsItemById);
router.put("/:id",authenticateToken, updateNewsItem);
router.delete("/:id",authenticateToken, deleteNewsItem);

export default router;
