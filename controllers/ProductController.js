class ProductController {
  static async getAll(req, res, next) {
    try {
      res.status(200).json({ message: "List products", data: [] });
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      res.status(200).json({ message: "Success add product" });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      res.status(200).json({ message: "Success edit product", data: {} });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.status(200).json({ message: "Success delete product", data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
