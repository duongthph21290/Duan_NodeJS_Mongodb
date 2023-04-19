const BrandCategory = require('../models/brand');
const asyncHandler = require('express-async-handler');

// Thêm Blog -  Category
const createBrand = asyncHandler(async (req, res) => {
    const data = await BrandCategory.create(req.body);
    return res.status(200).json({
        message: "Thêm brand thành công",
        success: data ? true : false,
        createdBrand: data ? data : "Không thể tạo mới Brand"
    });
});



// Lấy tất cả Blog - Category
const getAllBrand = asyncHandler(async (req, res) => {
    const data = await BrandCategory.find();
    return res.status(200).json({
        message: "Lấy tất cả blog thành  công",
        success: data ? true : false,
        getAllBrand: data ? data : "Không thể lấy tất cả Brand"
    });
});



// Update Blog - Category
const updateBrand = asyncHandler(async (req, res) => {
    const data = await BrandCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({
        message: "Cập nhật brand thành  công",
        success: data ? true : false,
        updatedBrand: data ? data : "Không thể cập nhật Brand"
    });
});



// Delete Blog - Category
const deleteBrand = asyncHandler(async (req, res) => {
    const data = await BrandCategory.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message: "Xóa brand thành công",
        success: data ? true : false,
        deletedBrand: data ? data : "Không thể xóa Brand"
    });
});


module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}