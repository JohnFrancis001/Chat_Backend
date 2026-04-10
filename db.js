const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDb Connected Successfully');
})
.catch((err) => {
    console.log('Connection failed', err);
})