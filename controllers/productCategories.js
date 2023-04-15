const ProductCategory = require('../models/productCategories');
const asyncHandler = require('express-async-handler');

// Thêm Category
const createCategory = asyncHandler(async (req, res) => {
    const data = await ProductCategory.create(req.body);
    return res.status(200).json({
        message: "Thêm danh mục thành công",
        success: data ? true : false,
        createCategory: data ? data : "Không thể tạo mới Product - Category"
    });
});

// Lấy tất cả Category
const getAllCategory = asyncHandler(async (req, res) => {
    const data = await ProductCategory.find().select('title _id')
    return res.status(200).json({
        message: "Lấy tất cả danh mục thành  công",
        success: data ? true : false,
        getAllCategory: data ? data : "Không thể lấy tất cả Product - Category"
    });
});



// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const data = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, {new : true});
    return res.status(200).json({
        message: "Cập nhật danh mục thành  công",
        success: data ? true : false,
        getAllCategory: data ? data : "Không thể cập nhật Product - Category"
    });
});



// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const data = await ProductCategory.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message: "Xóa danh mục thành  công",
        success: data ? true : false,
        getAllCategory: data ? data : "Không thể xóa Product - Category"
    });
});


module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}