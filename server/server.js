const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const  authRouter = require('./routes/auth-routes')

// mongoose.connect('mongodb+srv://vindhyalakshmiofficial_db_user:vindhya1@cluster0.eccgabx.mongodb.net/')
// const uri = 'mongodb+srv://vindhyalakshmiofficial_db_user:vindhya1@cluster0.eccgabx.mongodb.net/';
const uri = 'mongodb://localhost:27017/ecommerce2026';

console.log(uri);

mongoose.connect(uri)
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log(error));


const app = express();
const PORT = process.env.PORT || 5000


app.use(
    cors({
        origin:'http://localhost:5173',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : [
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Express',
            'Pages'

        ],
        credentials : true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));