const { default: mongoose } = require('mongoose');


const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if (conn.connection.readyState === 1) console.log('DataBase connect is successfully!')
        else console.log('DataBase connecting ');
    } catch (error) {
        console.log('DataBase connect is failed');
        throw new Error(error)
    }
}
module.exports = dbConnect;