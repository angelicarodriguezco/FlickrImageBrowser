const User = require('../models/User');
const bcrypt = require('bcrypt');
const {sendTemporaryPassword} = require('../services/EmailService');

const register = async (name, lastName, username, email, password) => {
    try {
        const newEncryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            lastName: lastName,
            username: username,
            email: email,
            password: newEncryptedPassword
        });

        const result = await user.save()
        console.log('User was registered correctly');
        return result;
    } catch (error) {
        console.error('Error registering user', error);
    }
}

const validateUser = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("Email or password incorrect");
    }

    if (user.loginAttempts >= 3) {
        throw new Error("User blocked, recover password")
    }


const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        if (!user.loginAttempts) {
            user.loginAttempts = 0;
        }
        user.loginAttempts = user.loginAttempts +1;
        user.save();
        throw new Error("Email or password incorrect");
    }
    user.loginAttempts = 0;
    user.save();
    return user;
};


const changePassword = async (username, newPassword, confirmPassword) => {
    try {
        if (newPassword !== confirmPassword) {
            return '/changePassword?error=Password%20does%20not%20coincide';
        }
        const newEncryptedPassword = await bcrypt.hash(newPassword, 10);
        const result = await user.findOne(
            {username: username},
            {$set: {password: newEncryptedPassword}}
        );

        if (result) {
            return
        }
    }
}