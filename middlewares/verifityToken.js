//để import module jsonwebtoken vào trong code của bạn. Module này cung cấp các hàm để tạo và xác thực JWT (JSON Web Token).
const jwt = require('jsonwebtoken');
//để import module express-async-handler vào trong code của bạn. Module này cung cấp một wrapper để bắt các lỗi bất đồng bộ (asynchronous errors) trong các middleware của ExpressJS.
const asyncHandler = require('express-async-handler');

// Đây là cách để định nghĩa middleware verifyAccessToken trong ExpressJS. Nó bắt đầu bằng cách sử dụng asyncHandler để bao bọc các lỗi bất đồng bộ (asynchronous errors) trong middleware.
const verifyAccessToken = asyncHandler(async (req, res, next) => {
    //Bearer token
    // một câu lệnh điều kiện để kiểm tra xem yêu cầu có chứa token truy cập hay không. Nếu có, nó sẽ tiếp tục xác thực token, ngược lại nó sẽ trả về lỗi không có quyền truy cập.
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        // Dạng headers : {authorization: Bearer token}
        // Đây là câu lệnh để lấy token từ yêu cầu và loại bỏ phần "Bearer " từ chuỗi token để lấy phần mã token thực sự.
        const token = req.headers.authorization.split(' ')[1]
        // Đây là hàm jwt.verify() để xác thực token và giải mã nó. Hàm này sử dụng secret key được lưu trữ trong biến môi trường JWT_SECRET để giải mã token.
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            // Đây là một câu lệnh điều kiện để kiểm tra xem token có hợp lệ hay không. Nếu không hợp lệ, nó sẽ trả về mã trạng thái lỗi 401 và một thông báo lỗi.
            if (err) return res.status(401).json({
                success: false,
                message: "Access Token không hết hạn"
            })
            console.log(decode);
            //Verifile sang đây !!!
            // Nếu xác thực token thành công, thông tin về người dùng được giải mã từ token và được gán vào đối tượng yêu cầu (req.user) để các yêu cầu
            //  sau này có thể sử dụng thông tin này.
            req.user = decode

            // Cuối cùng, mã sẽ gọi hàm next() để chuyển yêu cầu sang middleware tiếp theo trong chuỗi middleware hoặc chuyển đến tuyến đường (route) tương ứng.
            next()
        })
        // Nếu không tìm thấy token truy cập hoặc xác thực token không thành công, mã sẽ trả về mã trạng thái lỗi 401 và một thông báo lỗi.
    } else {
        return res.status(401).json({
            success: false,
            message: "Không tìm thấy authentication"
        })
    }
})

module.exports = {
    verifyAccessToken
}