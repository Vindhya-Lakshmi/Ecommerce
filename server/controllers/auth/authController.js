const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');




const registerUser = async (req, res) => {
    console.log("BODY:", req.body);
    const { userName, email, password } = req.body;
    try {

        const checkUser = await User.findOne((email));
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

const login = async (req, res) => {

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

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message,
            stack: e.stack

        })
    }
}

module.exports = { registerUser }


