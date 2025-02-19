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
        const result = await User.findOne(
            {username: username},
            {$set: {password: newEncryptedPassword}}
        );

        if (result) {
            return '/author?msg=Password%20updated';
        } else {
            return '/author?error=Error%20changing%20password';
        }
    } catch (error) {
        return '/author?error=' + error.message;
    }
};

const generateTemporaryPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = '';
    for (let i = 0; i < 8; i++) {
        temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return temporaryPassword;
};

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

const forgotPassword = async (email) => {
    const temporaryPassword = generateTemporaryPassword();
    const newEncryptedPassword = await bcrypt.hash(temporaryPassword, 10);
    const user = await User.findOneAndUpdate(
        {email: email},
        {password: newEncryptedPassword, loginAttempts : 0},
        {new: true}
    );
    if (user) {
        sendTemporaryPassword(user.email, user.name, temporaryPassword);
        return true;
    } else {
        return false;
    }};

const getProfilePhoto = async(username) => {
    const user = await User.findOne({
        username: username
    });
    if (user) {
        return user.profilePhoto;
    } else {
        return '';
    }
};

const searchUser = async (email) => {
    return await User.findOne({email});
}

const searchUserByUsername = async (username) => {
    return await User.findOne({username});
}

module.exports = {
    register,
    validateUser,
    changePassword,
    generateTemporaryPassword,
    generateOTP,
    forgotPassword,
    getProfilePhoto,
    searchUserByUsername,
    searchUser
}