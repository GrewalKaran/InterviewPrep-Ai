require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/database');
const port = process.env.PORT || 3000

const startServer = async () => {
        await connectDb();
        console.log("Database connected successfully");


        app.listen(port, () => {
            console.log('Server is running');
        });
};

startServer();