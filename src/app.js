import express from 'express'
import Product from './models/product-model.js'
import { isValidObjectId } from 'mongoose'
import NodeCache from 'node-cache'
import cors from 'cors'
import { Axiom } from '@axiomhq/js'
const app = express()

app.use(cors({
  origin: '*'
}))

const myCache = new NodeCache()

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN,
  orgId: process.env.AXIOM_ORG_ID
})

// Endpoint to get all products
app.get('/product', async (req, res) => {
  try {
    const products = await Product.find({})

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Endpoint to get a product by ID
app.get('/product/:id', async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID' })
  }

  const cachedProduct = myCache.get(id)
  if (cachedProduct !== undefined) {
    axiom.ingest('datadePrueba', [{ id: cachedProduct._id, cache: true }])
    return res.json(cachedProduct)
  }

  try {
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    myCache.set(id, product, 5)
    axiom.ingest('datadePrueba', [{ id: product._id, cache: false }])
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default app
