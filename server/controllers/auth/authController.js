const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');




const registerUser = async (req, res) => {
    console.log("BODY:", req.body);
    const { userName, email, password } = req.body;
    try {
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
    try {

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


