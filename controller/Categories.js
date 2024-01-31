const { Category } = require("../model/Category");

class CategoryController {
  static fetchCategories = async (req, res) => {
    try {
      const categories = await Categories.find({}).exec();
      res.status(200).json(categories);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  static createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
      const doc = await category.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
};

module.exports = CategoryController;
