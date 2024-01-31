const {Brand} = require('../model/Brand');

class BrandController {
    static fetchBrands = async(req,res) => {
        try{
            const brands = await Brand.find({}).exec();
            res.status(200).json(brands);
        }
        catch(err){
            res.status(400).json(err);
        }
    };
    static createBrand =  async(req,res) => {
        const brand =  new Brand(req.body);
        try{
         const doc = await brand.save();
         res.status(201).json(doc);
        }catch(err){
            res.status(400).json(err);
        }
    }
};

module.exports = BrandController;
