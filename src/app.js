import express from 'express'
import Product from './models/product-model.js'
import { isValidObjectId } from 'mongoose'
const app = express()

// Endpoint to get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({})

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Endpoint to get a product by ID
app.get('/product/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' })
  }

  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default app
