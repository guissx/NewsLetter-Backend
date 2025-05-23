import express from "express";
import { authenticateToken } from "../../middlewares/authmiddlewares";
import {
  createCarousel,
  getAllCarousel,
  getCarouselById,
  updateCarousel,
  deleteCarousel
} from "../../controllers/components/carousel.controller"; 

const router = express.Router();

router.post("/",authenticateToken, createCarousel);
router.get("/",authenticateToken, getAllCarousel);
router.get("/:id",authenticateToken, getCarouselById);
router.put("/:id",authenticateToken, updateCarousel);
router.delete("/:id",authenticateToken, deleteCarousel);

export default router;
