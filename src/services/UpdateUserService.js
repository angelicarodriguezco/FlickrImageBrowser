const User = require('../models/User');

async function updateUser(username, email, name, lastName, profilePhoto) {
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            throw new Error('User not found');
        }

        user.email = email;
        user.name = name;
        user.lastName = lastName;
        user.profilePhoto = profilePhoto;

        await user.save();

        return { success: true, message: 'User updated succesfully' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'There was an issue updating user' };
    }
}

module.exports = { updateUser };
