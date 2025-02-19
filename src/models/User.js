const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    lastName: {type:String, required:true},
    username: { type: String, required: true, unique: true },
    profilePhoto: { type: String, default: '/assets/default-profile-photo.png' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginAttempts: { type: Number, default: 0 },
}, { versionKey: false });

UserSchema.index({username: 1}, {unique: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;
