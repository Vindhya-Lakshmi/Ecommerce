const express = require('express');
const monngose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cora');

mongoose.connect('mongodb+srv://vindhyalakshmiofficial_db_user:FYWkIKXaT0FIQwZM@cluster0.eccgabx.mongodb.net/')
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log(error));


const app = express();
const PORT = process.env.PORT || 5000


app.use(
    cors({
        origin:' http://localhost:5173/',
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
)