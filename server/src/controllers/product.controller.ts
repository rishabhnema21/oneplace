import { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load products" });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized user" });

    const products = await queries.getProductByUserId(userId);
    return res.status(200).json(products);
  } catch (err) {
    console.log("error fetching user products", err);
    return res.status(500).json({ error: "Error fetching user products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id))
      return res.status(400).json({ error: "Invalid product id" });

    const product = await queries.getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.status(200).json(product);
  } catch (err) {
    console.log("Error getting product", err);
    return res.status(500).json({ error: "Error fetching product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized user" });

    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ error: "All Entries are required" });
    }

    const newProduct = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });

    return res.status(201).json(newProduct);
  } catch (err) {
    console.log("error in creating new product", err);
    return res.status(500).json({ error: "Failed to create new error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized user" });

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    if (Array.isArray(id))
      return res.status(400).json({ error: "Invalid product id" });

    const existingProduct = await queries.getProductById(id);
    if (!existingProduct)
      return res.status(404).json({ error: "Product Not Found" });

    if (existingProduct.userId != userId)
      return res
        .status(403)
        .json({ error: "You can only update your own products" });

    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
    });

    return res.status(200).json(product);
  } catch (err) {
    console.log("error updating product", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized user" });

    const { id } = req.params;

    if (Array.isArray(id))
      return res.status(400).json({ error: "Invalid product id" });

    const existingProduct = await queries.getProductById(id);
    if (!existingProduct)
      return res.status(404).json({ error: "Product Not Found" });

    if (existingProduct.userId != userId)
      return res
        .status(403)
        .json({ error: "You can only delete your own products" });

    const product = await queries.deleteProduct(id);

    return res.status(200).json(product);
  } catch (err) {
    console.log("error deleting product", err);
    return res.status(500).json({error: "Failed to delete product"});
  }
};
