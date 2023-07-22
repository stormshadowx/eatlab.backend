const express = require("express")
const productController = require("../controllers/productController")

const router = express()

// Routes
router.get("/", productController.getProduct)
router.get("/:id", productController.getProductById)
router.post("/", productController.createProduct)
router.put("/:id", productController.updateProductById)

module.exports = router
