const HttpError = require("../models/httpError")
const csv = require("csv-parser")
const fs = require("fs")
const csvWriter = require("csv-write-stream")
const csvParser = require("csv-parser")
const { v4: uuidv4 } = require("uuid")

function readDataFromCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row)
      })
      .on("end", () => {
        resolve(data)
      })
      .on("error", (err) => {
        reject(err)
      })
  })
}

const getProduct = async (req, res, next) => {
  let products

  try {
    products = await readDataFromCsvFile("./tmp/csv/data.csv")
  } catch (err) {
    const error = new HttpError("Could not find products", 404)
    return next(error)
  }
  res.status(200)
  res.json({
    products: products,
  })
}

const getProductById = async (req, res, next) => {
  const productId = req.params.id

  // Read existing data from the CSV file
  const existingProducts = []
  fs.createReadStream("./tmp/csv/data.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      existingProducts.push(row)
    })
    .on("end", () => {
      const product = existingProducts.find(
        (product) => product.id === productId
      )

      if (!product) {
        res.status(404).json({ error: "Product not found" })
      } else {
        res.status(200).json(product)
      }
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Error reading the CSV file" })
    })
}

const createProduct = async (req, res, next) => {
  const { name, price, qty } = req.body

  const id = uuidv4() // Generate a new UUID for the product

  const product = { id, name, price, qty }

  const writer = csvWriter({ sendHeaders: false })
  writer.pipe(fs.createWriteStream("./tmp/csv/data.csv", { flags: "a" }))
  writer.write(product)
  writer.end()

  res.status(201).json({ message: "Product added successfully", product })
}

const updateProductById = async (req, res, next) => {
  const productId = req.params.id // Assuming the product ID is provided as a route parameter
  const { name, price, qty } = req.body

  // Validate request data here if needed using Joi or other validation library

  // Read existing data from the CSV file
  const existingProducts = []
  fs.createReadStream("./tmp/csv/data.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      existingProducts.push(row)
    })
    .on("end", () => {
      // Find the product index in the existing data based on its ID
      const productIndex = existingProducts.findIndex(
        (product) => product.id === productId
      )

      if (productIndex === -1) {
        // Product with the specified ID not found
        res.status(404).json({ error: "Product not found" })
      } else {
        // Update the product details
        existingProducts[productIndex].name = name
        existingProducts[productIndex].price = price
        existingProducts[productIndex].qty = qty

        // Write the updated data back to the CSV file
        const writer = csvWriter()
        writer.pipe(fs.createWriteStream("./tmp/csv/data.csv"))
        existingProducts.forEach((product) => writer.write(product))
        writer.end()

        res.status(200).json({
          message: "Product updated successfully",
          product: existingProducts[productIndex],
        })
      }
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Error reading the CSV file" })
    })
}

exports.getProduct = getProduct
exports.getProductById = getProductById
exports.createProduct = createProduct
exports.updateProductById = updateProductById
