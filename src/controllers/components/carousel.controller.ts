import { Request, Response } from "express";
import mongoose from "mongoose";
import CarouselItem from "../../models/components/CarroselModel"; 

export const createCarousel = async (req: Request, res: Response): Promise<void> => {
  try {
    const newItem = new CarouselItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao criar item do carrossel", details: err.message });
  }
};

export const getAllCarousel = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await CarouselItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar itens do carrossel" });
  }
};

export const getCarouselById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const item = await CarouselItem.findById(id);
    if (!item) {
      res.status(404).json({ error: "Item não encontrado" });
      return;
    }
    res.status(200).json(item);
  } catch (err: any) {
    res.status(500).json({ error: "Erro na busca do item" });
  }
};

export const updateCarousel = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const updatedItem = await CarouselItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      res.status(404).json({ error: "Item não encontrado para atualização" });
      return;
    }
    res.status(200).json(updatedItem);
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao atualizar item", details: err.message });
  }
};

export const deleteCarousel = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const deletedItem = await CarouselItem.findByIdAndDelete(id);
    if (!deletedItem) {
      res.status(404).json({ error: "Item não encontrado para exclusão" });
      return;
    }
    res.status(200).json({ message: "Item excluído com sucesso" });
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao excluir item" });
  }
};

