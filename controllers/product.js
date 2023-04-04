const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')


// Tạo sản phẩm
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        message: " Tạo sản phẩm thành công",
        success: newProduct ? true : false,
        newProduct
    })
}
);


// Lấy 1 sản phẩm
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    return res.status(200).json({
        message: "Lấy 1 sản phẩm thành công",
        success: product ? true : false,
        getProduct : product ? product : 'Không lấy được 1 sản phẩm'
    })
}
);

// Lấy tất cả sản phẩm
// Filterting, sorting & pagination
const getAllProduct = asyncHandler(async (req, res) => {
    const product = await Product.find();
    return res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: product ? true : false,
        getAllProduct : product ? product : 'Không lấy được tất cả sản phẩm'
    })
}
);


// Cập nhật sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
    return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        success: product ? true : false,
        updateProduct : product ? product : 'Không thể cập nhật được sản phẩm'
    })
}
);


// Xóa sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).json({
        message: "Xóa sản phẩm thành công",
        success: product ? true : false,
        updateProduct : product ? product : 'Không thể xóa được sản phẩm'
    })
}
);


module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}