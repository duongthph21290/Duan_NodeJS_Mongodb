const BlogCategory = require('../models/blogCategories');
const asyncHandler = require('express-async-handler');

// Thêm Blog -  Category
const createBlog = asyncHandler(async (req, res) => {
    const data = await BlogCategory.create(req.body);
    return res.status(200).json({
        message: "Thêm blog thành công",
        success: data ? true : false,
        createBlog: data ? data : "Không thể tạo mới Blog - Category "
    });
});



// Lấy tất cả Blog - Category
const getAllBlog = asyncHandler(async (req, res) => {
    const data = await BlogCategory.find().select('title _id')
    return res.status(200).json({
        message: "Lấy tất cả blog thành  công",
        success: data ? true : false,
        getAllBlog: data ? data : "Không thể lấy tất cả Blog - Category"
    });
});



// Update Blog - Category
const updateBlog = asyncHandler(async (req, res) => {
    const data = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({
        message: "Cập nhật blog thành  công",
        success: data ? true : false,
        updateBlog: data ? data : "Không thể cập nhật Blog - Category"
    });
});



// Delete Blog - Category
const deleteBlog = asyncHandler(async (req, res) => {
    const data = await BlogCategory.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message: "Xóa blog thành công",
        success: data ? true : false,
        deleteBlog: data ? data : "Không thể xóa Blog - Category"
    });
});


module.exports = {
    createBlog,
    getAllBlog,
    updateBlog,
    deleteBlog
}