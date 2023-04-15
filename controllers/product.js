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
        getProduct: product ? product : 'Không lấy được 1 sản phẩm'
    })
}
);


// Lấy tất cả sản phẩm
// Filterting, sorting & pagination
const getAllProduct = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);

    // Filtering (Lọc theo tên)
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Product.find(formatedQueries);

    //Sorting ( Sắp xếp)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy)
    };

    //Fields limit (Loại bỏ các trường không mong muốn)
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    };


    //Paginate (Phân trang)
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Excute query
    // Sử dụng await để thực thi truy vấn và trả về kết quả 
    const response = await queryCommand.exec();
    // Sử dụng await để đếm số lượng tài liệu phù hợp với truy vấn
    const counts = await Product.find(formatedQueries).countDocuments();
    return res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: response ? true : false,
        counts,
        getAllProduct: response ? response : 'Không lấy được tất cả sản phẩm',

    });
});




// Cập nhật sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        success: product ? true : false,
        updateProduct: product ? product : 'Không thể cập nhật được sản phẩm'
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
        updateProduct: product ? product : 'Không thể xóa được sản phẩm'
    })
}
);


// Đánh giá sản phẩm
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) throw new Error('Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    // console.log({ alreadyRatings });
    if (alreadyRating) {
        // Update lại star & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true });

    } else {
        // Add star & comment
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true })
    }


    // Tính toán ( SUM ratings) -> tính toán đánh giá 
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;

    await updatedProduct.save();


    return res.status(200).json({
        message: "Cảm ơn bạn đã đánh giá",
        status: true,
        updatedProduct

    });

});



module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    ratings
};