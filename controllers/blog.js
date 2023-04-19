const Blog = require('../models/blog');
const asynHandler = require('express-async-handler');


// Lấy tất cả Blog
const getAllBlog = asynHandler(async (req, res) => {
    const data = await Blog.find();
    return res.status(200).json({
        message: "Lấy tất cả Blog thành công",
        success: data ? true : false,
        getAllBlog: data ? data : 'Không thể lấy tất cả Blog được!'
    })
});



// Lấy 1 Blog
const getBlog = asynHandler(async (req, res) => {
    const { bid } = req.params;
    const data = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname mobile email')
        .populate('dislikes', 'firstname lastname mobile email');
    return res.status(200).json({
        message: "Lấy 1 Blog thành công",
        success: data ? true : false,
        getBlog: data ? data : "Không thể lấy được 1 Blog"
    })
});



// Thêm Blog
const createNewBlog = asynHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error("Missing inputs")
    const data = await Blog.create(req.body);
    return res.status(200).json({
        message: "Tạo Blog thành công",
        success: data ? true : false,
        createdBlog: data ? data : 'Không tạo được Blog!'
    })
});


// Update Blog
const updateBlog = asynHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    const data = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        message: "cập nhật Blog thành công",
        success: data ? true : false,
        updatedBlog: data ? data : 'Không thể cập nhật được Blog!'

    })
});



// Update Blog
const removeBlog = asynHandler(async (req, res) => {
    const { bid } = req.params;
    const data = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        message: "Xóa Blog thành công",
        success: data ? true : false,
        removedBlog: data ? data : 'Không thể xóa được Blog!'

    })
});








/**
 * Khi người dùng like 1 bài blog thì: 
 * 1. Check xem người đó trước đó có dislike hay không -> nếu có dislike thì bỏ dislike
 * 2. Check xem người đó có like hay không -> Nếu có like thì bỏ like hoặc thêm like
 */


// Like Blog (Thích bài viết Blog)
const likeBlog = asynHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing Inputs");
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id);
    if (alreadyDisliked) {
        const data = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        })
    };
    const isLiked = blog?.likes?.find(el => el.toString() === _id);
    if (isLiked) {
        const data = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        });
    } else {
        const data = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        });
    }

});



// Không Like Blog (Dis like bài viết Blog)
const disLikeBlog = asynHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing Inputs");
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.dislikes?.find(el => el.toString() === _id);
    if (alreadyLiked) {
        const data = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        })
    };
    const isDisiked = blog?.dislikes?.find(el => el.toString() === _id);
    if (isDisiked) {
        const data = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        });
    } else {
        const data = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
        return res.json({
            success: data ? true : false,
            message: data
        });
    }

});





module.exports = {
    createNewBlog,
    updateBlog,
    removeBlog,
    getAllBlog,
    getBlog,
    likeBlog,
    disLikeBlog
}