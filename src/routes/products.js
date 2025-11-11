import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all products for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add new product
router.post("/", auth, async (req, res) => {
  try {
    console.log("🧠 req.user:", req.user);
    console.log("📦 req.body:", req.body);

    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newProduct = await Product.create({
      userId: req.user.id,
      name,
      price,
      description,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🔥 Error in POST /api/products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update product
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, price, description },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete product
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
