import express from "express";
import { authenticateToken } from "../../middlewares/authmiddlewares";
import upload from "../../middlewares/upload";
import {
  createCarousel,
  getAllCarousel,
  getCarouselById,
  updateCarousel,
  deleteCarousel
} from "../../controllers/components/carousel.controller"; 

const router = express.Router();

router.post("/",upload.single("image"),authenticateToken, createCarousel);
router.get("/", getAllCarousel);
router.get("/:id", getCarouselById);
router.put("/:id",authenticateToken,upload.single("image"), updateCarousel);
router.delete("/:id",authenticateToken, deleteCarousel);

export default router;
