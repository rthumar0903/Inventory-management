const express = require("express")
const router = express.Router()
const { getProducts,createProduct,deleteProduct,editProduct } = require("./productcontroller")


router.route("/create-product").post(createProduct)
router.route("/get-products").get(getProducts)
router.route("/delete-product/:productId").delete(deleteProduct)
router.route("/update-product/:productId").put(editProduct)
module.exports = router