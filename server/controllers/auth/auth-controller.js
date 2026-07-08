const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');




const registerUser = async (req, res) => {
    console.log("BODY:", req.body);
    const { userName, email, password } = req.body;
    try {

        const checkUser = await User.findOne({email});
        if (checkUser) return res.json({ success: false, message: 'User Already exists with the same email! Please try again' })

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,


        });
        console.log("About to save:", newUser);
        console.log({
            userName,
            email,
            password
        });
        console.log(User.schema.obj);

        await newUser.save()
        res.status(200).json({
            success: true,
            message: "registration successful",
        })

    } catch (e) {

        console.log("REGISTER ERROR:", e);
        res.status(500).json({
            success: false,
            message: e.message,
            stack: e.stack
        })
    }
};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const checkUser = await User.findOne({ email });
        if(!checkUser) return res.json({
            success : false,
            message : "User doesn't exists! Please register first"
        })

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch)return res.json({
            success : false,
            message : "Incorrect password! Please try again"
        })

        const token = jwt.sign({
            id : checkUser._id, 
            role : checkUser.role, 
            email : checkUser.email,
            username : checkUser.userName,
        },
         'CLIENT_SECRET_KEY', {expiresIn : '5m'})

        res.cookie('token', token, {httpOnly: true, secure : false}).json({
            success : true,
            message : 'Logged in successfully',
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id : checkUser._id,
                username : checkUser.userName,
            }
    })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message,
            stack: e.stack

        })
    }
};

const logoutUser = (req, res)=> {
    res.clearCookie('token').json({
        success : true,
        message : 'Logged out successfully!'
    })
};

const authMiddleware = async(req,res,next)=> {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success : false,
        message : 'Unauthorized user!'
    })
    try {
        const decode = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    }
    catch (error) {
        res.status(401).json ({
        success : false,
        message : 'Unauthorized user!'  
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware }


