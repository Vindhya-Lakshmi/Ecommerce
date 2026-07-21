const Product = require('../../models/Product');


const getFilteredProducts = async(req, res)=> {
    try {

          const { category = [], brand = [], sortBy = "price-low-to-high" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-low-to-high":
        sort.price = 1;

        break;
      case "price-high-to-low":
        sort.price = -1;
         break;

      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

        const products = await Product.find(filters).Sort()
        res.status(200).json({
            success : true,
            data : products
        })
    }catch(e) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
};

module.exports = { getFilteredProducts };