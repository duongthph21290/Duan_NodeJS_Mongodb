const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const User = require('../models/user');
//Bắt lỗi express-async-handler
const asyncHandler = require('express-async-handler');

// Đăng kí
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            message: "Thất bại"
        })
    const user = await User.findOne({ email })
    if (user)
        throw new Error('Tài khoản đã tồn tại')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            message: newUser ? 'Đăng kí thành công! Vui lòng đăng nhập' : 'Something went wrong'
        })
    }


})


// Đăng nhập
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            message: "Thất bại"
        })
    const response = await User.findOne({ email })
    // console.log(response.isCorrectPassword(password));
    if (response && await response.isCorrectPassword(password)) {
        // tách password và role ra khỏi respose (Không trả về cho client)
        const { password, role, ...userData } = response.toObject();
        //Tạo accessToken:
        const accessToken = generateAccessToken(response._id, role);
        //Tạo refreshToken:
        const refreshToken = generateRefreshToken(response._id);
        //Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true })
        //Lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            message: "Đăng nhập thành công!",
            success: true,
            accessToken,
            userData,

        })
        // Refresh token có tác dụng -> Cấp mới access token
        // Access Token có tác dụng -> Xác thực người dùng (Authentication), phân quyền người dùng (Authorization)
    } else {
        throw new Error('Đăng nhập thất bại!')
    }
})

// Lấy thông tin của 1 user
const getCurrent = asyncHandler(async (req, res) => {
    //Verifile sang verifityToken (Chỗ gán req.user = decode) // file middleware -> verifitytoken.js
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password -role') // sử dụng select để không lấy (hiện) ra các trường bên!
    return res.status(200).json({
        message: "Lấy thông tin thành công",
        success: false,
        //Nếu có user thì trả về user , không có user thì trả về "User not found"
        user: user ? user : "User not found"
    })
})





module.exports = {
    register,
    login,
    getCurrent
}