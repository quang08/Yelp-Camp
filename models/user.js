const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true 
        //If you try to create two users with the same email, you'll get a duplicate key error.
    }
});

UserSchema.plugin(passportLocalMongoose); 
//automatically adds an username and password field
//while making sure those usernames are unique, not duplicated

module.exports = mongoose.model('User', UserSchema);
