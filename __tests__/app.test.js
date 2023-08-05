import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app'
import Product from '../src/models/product-model'
import 'dotenv/config'

describe('GET /product/:id', () => {
  beforeAll(async () => {
    // Connect to a test database before running tests
    const MONGO_TEST_URI = process.env.MONGO_URI

    await mongoose.connect(MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  afterAll(async () => {
    // Close the database connection after all tests are done
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clear the test database before each test
    await Product.deleteMany({})
  })

  it('should return a product when given a valid ID', async () => {
    const product = new Product({
      name: 'Test Product',
      price: 9.99,
      description: 'This is a test product'
    })
    await product.save()

    const response = await request(app).get(`/product/${product._id}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(product._id.toString())
    expect(response.body.name).toBe(product.name)
    expect(response.body.price).toBe(product.price)
    expect(response.body.description).toBe(product.description)
  })

  it('should return 404 when given an invalid ID', async () => {
    const response = await request(app).get('/product/123412341234')

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Product not found')
  })

  it('should return 500 when there is an error', async () => {
    jest.spyOn(Product, 'findById').mockRejectedValue(new Error('Database error'))

    const response = await request(app).get('/product/123')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Something went wrong')
  })
})
