const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


mongoose.connect(DATABASE_URL_HERE, {useNewUrlParser: true, useUnifiedTopology: true});


const ColoringPage = mongoose.model('ColoringPage', { 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: String // for now
 });

 const Favorite = mongoose.model('Favorite', {
    title: {
        type: String,
        required: true,
        minLength: 2
    },
    description: {
        type: String,
        required: true,
        minLength: 2
    },
    image: {
        type: String,
        minLength: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // userSchema below
        required: true
    }
});

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    encryptedPassword: {
        type: String,
        required: true,
    }
});

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.encryptedPassword;
    return obj
};
userSchema.methods.setEncryptedPassword = function (plainPassword, callback) {
    bcrypt.hash(plainPassword, 12).then(hash => {
        this.encryptedPassword = hash;
        callback();
    });
};
// i've got something wrong here

userSchema.methods.verifyPassword = function(plainPassword, callback) {
    bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
        callback(result);
        // the callback is a good way to do a return because if we just did return; it wouldn't have finished doing the bcrypt yet
    });
};

const User = mongoose.model('User', userSchema);


module.exports = {
    ColoringPage: ColoringPage,
    Favorite: Favorite,
    User: User
};