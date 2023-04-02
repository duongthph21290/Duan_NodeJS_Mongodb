const { default: mongoose } = require('mongoose');


const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if (conn.connection.readyState === 1) console.log('Kết nối Database thành công!')
        else console.log('DataBase connecting ');
    } catch (error) {
        console.log('Kết nối Database thất bại!');
        throw new Error(error)
    }
}
module.exports = dbConnect;