const express = require("express")
const multer = require("multer")
const csv = require("csv-parser")
const fs = require("fs")
const Joi = require("joi")
const bodyParser = require("body-parser")

const app = express()
const upload = multer({ dest: "tmp/csv/" })

app.use(bodyParser.json({}))

// Userdefined Route
const productRoute = require("./routes/product")

let store = []

const productSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  qty: Joi.number().required(),
})

app.post("/upload-csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "missing file" })
    return
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const validationResult = productSchema.validate(data)
      if (validationResult.error) {
        res.status(400).json({ error: validationResult.error.details })
        return
      }
      store = [...store, validationResult.value]
    })
    .on("end", () => {
      res.json(store)
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error while deleting temp file ", err)
      })
    })
})

// Base Route
app.use("/api/products", productRoute)

// Handling Route Error
app.use((req, res, next) => {
  const error = new HttpError("Could not found the route", 404)
  return next(error)
})

// Handling Unknown Route Error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occured" })
})

app.listen(3000, () => {
  console.log("Server listening on port 3000")
})
