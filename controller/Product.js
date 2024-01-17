const ProductModel = require('../model/Product');

class ProductController {
  static createProduct = async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        thumbnail,
        images,
        colors,
        sizes,
        highlights,
        discountPrice,
        deleted,
      } = req.body;

      // Additional validation could be added here based on your requirements

      const newProduct = await ProductModel.create({
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        thumbnail,
        images,
        colors,
        sizes,
        highlights,
        discountPrice,
        deleted,
      });

      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        // Handle validation errors
        res.status(400).json({ error: 'Validation Error', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

module.exports = ProductController;
