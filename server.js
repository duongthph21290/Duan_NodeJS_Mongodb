const express = require('express');
// Biến môi trường
require('dotenv').config();
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')


const app = express();
const port = process.env.PORT || 8888;
// Đọc được kiểu dạng json từ phía client gửi lên
app.use(express.json());

// Đọc được dữ liệu từ form và chuyển đổi thành đối tượng JS (Từ phía client gửi lên server)
// Tham số: {extended: true} sử dụng để có thể đọc được nhiều đối tượng khác nhau
app.use(express.urlencoded({extended: true}));


//Kết nối với mongodb
dbConnect();

initRoutes(app);

//Router
app.use('/',(req, res) => { res.send('Server chạy thành công!!!')})


// Lắng nghe port
app.listen(port, ()=>{
    console.log('Server running on the port: ' + port);
})