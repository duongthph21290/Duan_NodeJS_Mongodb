const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const User = require('../models/user');
//Bắt lỗi express-async-handler
const asyncHandler = require('express-async-handler');
// jsonwebtoken
const jwt = require('jsonwebtoken');
const { signinSchema, signupSchema } = require('../schemas/user');
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto');

// Đăng kí
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            message: errors,
        });
    }
    // if (!email || !password || !firstname || !lastnames)
    //     return res.status(400).json({
    //         sucess: false,
    //         message: "Thất bại"
    //     })

    // Kiểm tra email
    const user = await User.findOne({ email })
    if (user)
        throw new Error('Email đã tồn tại');
    const newUser = await User.create({
        email,
        password,
        firstname,
        lastname,
        mobile
    });
    return res.status(200).json({
        success: newUser ? true : false,
        message: newUser ? 'Đăng kí thành công! Vui lòng đăng nhập' : 'Something went wrong'
    })
}


)


// Đăng nhập
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            message: errors,
        });
    }
    // if (!email || !password)
    //     return res.status(400).json({
    //         sucess: false,
    //         message: "Thất bại"
    //     })
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



// RefreshAccessToken (Lấy lại token refreshToken khi token accessToken đã hết hạn)
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ Cookies
    const cookie = req.cookies;
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('Không thể refresh token trong cookies');
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const respone = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: respone ? true : false,
        newAccessToken: respone ? generateAccessToken(respone._id, respone.id) : "Refresh token not matched"
    })
})


// Logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('Không thể Refresh token trong cookies')

    // Xóa refresh Token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        message: 'Logout thành công'
    })
})


// Client gửi gmail
// Server check gmail có hợp lệ không => Gửi mail + kèm theo link (password change token)
// Client gửi api kèm theo token
// Check token có giống với token mà server gửi email hay không
// Change password

const forgotpassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error("Không có email");
    const user = await User.findOne({ email });
    if (!user) throw Error('Không tìm thấy người dùng!');
    const resetToken = user.createPasswordChangedToken();
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
});



// Reset mật khẩu
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    // console.log(token, password);
    if (!password || !token) throw new Error('Vui lòng nhập trường');
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Không thể reset token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? " Update password thành công! Vui lòng đăng nhập lại!" : "Update thất bại"
    })
})


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotpassword,
    resetPassword

}