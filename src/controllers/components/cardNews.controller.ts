import { Request, Response } from "express";
import mongoose from "mongoose";
import NewsItem from "../../models/components/CardNewsModel"

// Criar noticia 
export const createNewsItem = async (req: Request, res: Response) => {
  try {
    const newItem = new NewsItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao criar notícia", details: err.message });
  }
};

// Listar todos as noticias
export const getAllNewsItems = async (_req: Request, res: Response) => {
  try {
    const items = await NewsItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar notícias" });
  }
};

// Buscar notícia por ID
export const getNewsItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const item = await NewsItem.findById(id);
    if (!item) {
      res.status(404).json({ error: "Notícia não encontrada" });
      return;
    }
    res.status(200).json(item);
  } catch (err: any) {
    res.status(500).json({ error: "Erro na busca da notícia" });
  }
};

// Atualizar notícia por ID
export const updateNewsItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const updatedItem = await NewsItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      res.status(404).json({ error: "Notícia não encontrada para atualização" });
      return;
    }
    res.status(200).json(updatedItem);
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao atualizar notícia", details: err.message });
  }
};

// Deletar notícia por ID
export const deleteNewsItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const deletedItem = await NewsItem.findByIdAndDelete(id);
    if (!deletedItem) {
      res.status(404).json({ error: "Notícia não encontrada para exclusão" });
      return;
    }
    res.status(200).json({ message: "Notícia excluída com sucesso" });
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao excluir notícia" });
  }
};
