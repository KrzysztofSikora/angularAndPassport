/**
 * Created by krzysztof on 23.06.16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    }
});

mongoose.model('User', UserSchema);
